import m from "mithril";
import store from "./store";
import { emptyClipboard } from "./selection";

function call(route, data) {
  m.redraw();
  return m.request({
    method: "POST",
    url: "api/" + route,
    data,
    config(xhr) {
      xhr.responseType = "json";
    },
    deserialize(i) {
      return i;
    },
    extract(xhr) {
      if (xhr.status !== 200) throw new Error(`Unexpected HTTP status code ${xhr.status}`);
      return xhr.response;
    },
  })
  .then((response) => {
    if (response.error) {
      throw Object.assign(new Error(response.error.message), response.error);
    }
    return response;
  });
}

export function signin(passphrase) {
  return call("list", { passphrase }).then((list) => {
    store.setList(list);
    store.setPassphrase(passphrase);
  });
}

export function get(path) {
  return call("get", { passphrase: store.passphrase, path });
}

export function logout() {
  emptyClipboard();
  store.setList();
}
