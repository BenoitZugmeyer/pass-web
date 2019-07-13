const { promisify } = require("util")
const kbpgp = require("kbpgp")
const F = kbpgp.const.openpgp

function promisifyMethod(method) {
  return promisify(method.call.bind(method))
}
const generateKeyManager = promisify(kbpgp.KeyManager.generate)
const signKeyManager = promisifyMethod(kbpgp.KeyManager.prototype.sign)
const exportGPGPrivate = promisifyMethod(
  kbpgp.KeyManager.prototype.export_pgp_private,
)

async function generateKey() {
  const keyManager = await generateKeyManager({
    userid: "User McTester (Born 1979) <user@example.com>",
    primary: {
      nbits: 1024,
      flags: F.certify_keys,
    },
    subkeys: [
      {
        nbits: 1024,
        flags: F.sign_data,
      },
      {
        nbits: 1024,
        flags: F.encrypt_comm | F.encrypt_storage,
      },
    ],
  })

  await signKeyManager(keyManager, {})
  return {
    privateKey: await exportGPGPrivate(keyManager, {
      passphrase: "abc",
    }),
    encrypt(content, { armored = false } = {}) {
      return new Promise((resolve, reject) => {
        kbpgp.box(
          { msg: content, encrypt_for: keyManager },
          (error, armoredResult, rawResult) => {
            if (error) reject(error)
            else if (armored) resolve(armoredResult)
            else resolve(rawResult)
          },
        )
      })
    },
  }
}

let cachedKey

module.exports = () => {
  if (!cachedKey) cachedKey = generateKey()
  return cachedKey
}
