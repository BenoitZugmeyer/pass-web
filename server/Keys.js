"use strict"

const fs = require("fs")
const kbpgp = require("kbpgp")

const promiseUtil = require("./promiseUtil")
const log = require("./log")

const importFromArmoredPGP = promiseUtil.wrapCPS(kbpgp.KeyManager.import_from_armored_pgp)
const fileRead = promiseUtil.wrapCPS(fs.readFile)
const unbox = promiseUtil.wrapCPS(kbpgp.unbox)

class KeyError extends Error {}

function keyId(key) {
  let fullKey
  if (typeof key === "string") fullKey = key
  else if (Buffer.isBuffer(key)) fullKey = key.toString("hex")
  else if (key.get_pgp_key_id) fullKey = key.get_pgp_key_id().toString("hex")
  else throw new KeyError("Invalid key id type")

  if (!/^[0-9a-f]*$/i.test(fullKey)) throw new KeyError(`Invalid key id value ${fullKey}`)

  return fullKey.slice(-8).toLowerCase()
}

module.exports = class Keys {

  constructor() {
    this._keys = new Map()
  }

  add(manager) {
    for (const id of manager.get_all_pgp_key_ids()) {
      const material = manager.find_pgp_key_material(id)
      const emails = material.get_signed_userids().map((u) => u.get_email())
      const printableEmails = emails.length ? ` (${emails.join(", ")})` : ""

      log.info(`Add key ${keyId(id)}${printableEmails}`)
      this._keys.set(keyId(id), {
        manager,
        material,
      })
    }
  }

  verify(ids, passphrase) {
    const key = ids.reduce((key, id) => key || this._get(id), null)
    if (!key) throw new KeyError("No key found")
    return this.verifyKey(key, passphrase)
  }

  verifyKey(key, passphrase) {
    const material = key.material
    return (
      promiseUtil.wrapCPS(material.unlock.bind(material))({ passphrase })
        .then(() => true, () => false)
    )
  }

  decrypt(content, passphrase) {

    if (!passphrase) throw new Error("passphrase is required")

    const fetch = async (ids, opts) => {
      for (let index = 0; index < ids.length; index++) {
        const requestId = keyId(ids[index])
        const key = this._getById(requestId)
        if (!key) continue

        if ((await this.verifyKey(key, passphrase)) && key.material.key.can_perform(opts)) {
          return { manager: key.manager, index }
        }
      }

      throw new KeyError("No key found")
    }

    return unbox({
      raw: content,
      msg_type: kbpgp.const.openpgp.message_types.generic,
      keyfetch: {
        fetch(ids, opts, cb) {
          fetch(ids, opts)
            .then((result) => cb(null, result.manager, result.index),
              (error) => cb(error))
        },
      },
    })
  }

  isEmpty() {
    return this._keys.size === 0
  }

  _get(idOrEmail) {
    return idOrEmail.indexOf("@") > 0 ? this._getByEmail(idOrEmail) : this._getById(idOrEmail)
  }

  _getById(id) {
    id = keyId(id)
    return this._keys.get(id)
  }

  _getByEmail(email) {
    for (const key of this._keys.values()) {
      for (const userid of key.material.get_signed_userids()) {
        if (userid.get_email() === email) return key
      }
    }
  }

  addFromFile(filePath) {
    return (
      fileRead(filePath)
        .then((armored) => importFromArmoredPGP({ armored }))
        .then((manager) => this.add(manager))
    )
  }

}
