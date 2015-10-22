var m = require("mithril");
var store = require("./store");

function call(route, data) {
  m.redraw();
  return m.request({ method: "POST", url: "/api/" + route, data })
  .then((response) => {
    if (response.error) {
      throw Object.assign(new Error(response.error.message), response.error);
    }
    return response;
  });
}

module.exports = {

  signin(passphrase) {
    return call("list", { passphrase }).then((list) => {
      store.setList(list);
      store.setPassphrase(passphrase);
    });
  },

  get(path) {
    return call("get", { passphrase: store.passphrase, path });
  },

  logout() {
    store.setList();
  },

};
