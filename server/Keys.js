"use strict";

const fs = require("fs");
const kbpgp = require("kbpgp");

const promiseUtil = require("./promiseUtil");
const log = require("./log");

const importFromArmoredPGP = promiseUtil.wrapCPS(kbpgp.KeyManager.import_from_armored_pgp);
const fileRead = promiseUtil.wrapCPS(fs.readFile);
const unbox = promiseUtil.wrapCPS(kbpgp.unbox);

class KeyError extends Error {}

function keyId(key) {
  let fullKey;
  if (typeof key === "string") fullKey = key;
  else if (Buffer.isBuffer(key)) fullKey = key.toString("hex")
  else if (key.get_pgp_key_id) fullKey = key.get_pgp_key_id().toString("hex");
  else throw new KeyError("Invalid key id type");

  if (!/^[0-9a-f]*$/i.test(fullKey)) throw new KeyError(`Invalid key id value ${fullKey}`);

  return fullKey.slice(-8).toLowerCase();
}

module.exports = class Keys {

  constructor() {
    this._keys = new Map();
  }

  add(manager) {
    for (const id of manager.get_all_pgp_key_ids()) {
      log.info`Add key ${keyId(id)}`;
      this._keys.set(keyId(id), {
        manager,
        material: manager.find_pgp_key_material(id),
      });
    }
  }

  verify(id, passphrase) {
    const material = this._get(id).material;

    return (
      promiseUtil.wrapCPS(material.unlock.bind(material))({ passphrase })
      .then(() => true, () => false)
    );
  }

  decrypt(content, passphrase) {

    if (!passphrase) throw new Error("passphrase is required");

    const fetch = promiseUtil.wrapRun(function* (ids, opts) {
      let error;
      for (let index = 0; index < ids.length; index++) {
        const requestId = keyId(ids[index]);
        let key;
        try {
          key = this._get(requestId);
        }
        catch (e) {
          error = e;
          continue;
        }

        if ((yield this.verify(requestId, passphrase)) && key.material.key.can_perform(opts)) {
          return { manager: key.manager, index };
        }
      }

      throw (error || new KeyError("No key found"));
    }.bind(this));

    return unbox({
      raw: content,
      msg_type: kbpgp.const.openpgp.message_types.generic,
      keyfetch: {
        fetch(ids, opts, cb) {
          fetch(ids, opts)
          .then((result) => cb(null, result.manager, result.index),
                (error) => cb(error));
        },
      },
    });
  }

  _get(id) {
    id = keyId(id);
    if (!this._keys.has(id)) throw new KeyError(`Key ${id} not found`);
    return this._keys.get(id);
  }

  addFromFile(filePath) {
    return (
      fileRead(filePath)
      .then((armored) => importFromArmoredPGP({ armored }))
      .then((manager) => this.add(manager))
    );
  }

};
