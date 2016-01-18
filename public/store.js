import m from "mithril";

const callbacks = [];

function register(cb) {
  callbacks.push(cb);
}

function emit() {
  callbacks.forEach((cb) => cb());
}

register(() => m.redraw());

let list = false;
let passphrase = false;

export default {

  setList(list_) {
    list = list_;
    emit();
  },

  setPassphrase(passphrase_) {
    passphrase = passphrase_;
    emit();
  },

  logout() {
    list = false;
  },

  get loggedIn() {
    return Boolean(list);
  },

  get passphrase() {
    return passphrase;
  },

  get list() {
    return list || [];
  },

  register,

};
