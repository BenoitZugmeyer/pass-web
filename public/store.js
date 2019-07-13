let callbacks = []

function emit() {
  callbacks.forEach(cb => cb())
}

let list = false
let passphrase = false

export default {
  setList(list_) {
    list = list_
    emit()
  },

  setPassphrase(passphrase_) {
    passphrase = passphrase_
    emit()
  },

  logout() {
    list = false
  },

  get loggedIn() {
    return Boolean(list)
  },

  get passphrase() {
    return passphrase
  },

  get list() {
    return list || []
  },

  register(cb) {
    callbacks.push(cb)
  },

  unregister(cb) {
    callbacks = callbacks.filter(other => other !== cb)
  },
}
