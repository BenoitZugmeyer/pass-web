import m from "mithril";

function emit() {
  m.redraw();
}

var list = false;
var passphrase = false;

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

};
