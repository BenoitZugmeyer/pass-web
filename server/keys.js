"use strict";

const fs = require("fs");
const kbpgp = require("kbpgp");

const PromiseUtil = require("./promise-util");

const importFromArmoredPGP = PromiseUtil.wrapCPS(kbpgp.KeyManager.import_from_armored_pgp);
const fileRead = PromiseUtil.wrapCPS(fs.readFile);
const unbox = PromiseUtil.wrapCPS(kbpgp.unbox);

class KeyError extends Error {}

module.exports = class Keys {

  constructor() {
    this._keys = new Map();
  }

  add(key) {
    this._keys.set(key.get_pgp_short_key_id(), key);
  }

  has(id) {
    return this._keys.has(id);
  }

  verify(id, passphrase) {
    const key = this._get(id);

    return (
      PromiseUtil.wrapCPS(key.unlock_pgp.bind(key))({ passphrase })
      .then(() => true, () => false)
    );
  }

  decrypt(id, content) {
    const key = this._get(id);

    return unbox({
      raw: content,
      msg_type: kbpgp.const.openpgp.message_types.generic,
      keyfetch: {
        fetch(ids, opts, cb) {
          cb(null, key, 0);
        },
      },
    });
  }

  _get(id) {
    if (!this.has(id)) return Promise.reject(new KeyError(`Key ${id} not found`));
    return this._keys.get(id);
  }

  addFromFile(filePath) {
    return (
        fileRead(filePath)
        .then((armored) => importFromArmoredPGP({ armored }))
        .then((key) => this.add(key))
    );
  }

};
