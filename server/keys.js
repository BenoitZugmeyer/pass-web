"use strict";

const fs = require("fs");
const kbpgp = require("kbpgp");

const PromiseUtil = require("./promise-util");

const importFromArmoredPGP = PromiseUtil.wrapCPS(kbpgp.KeyManager.import_from_armored_pgp);
const fileRead = PromiseUtil.wrapCPS(fs.readFile);

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
    if (!this.has(id)) return Promise.reject(new KeyError(`Key ${id} not found`));

    const key = this._keys.get(id);

    return (
      PromiseUtil.wrapCPS(key.unlock_pgp.bind(key))({ passphrase })
      .then(() => true, () => false)
    );
  }

  get(id) {
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
