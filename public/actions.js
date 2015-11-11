import m from "mithril";
import store from "./store";
import { finally_ } from "./promiseUtil";
import { emptyClipboard } from "./selection";

function call(route, data) {
  return m.request({
    background: true,
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
    })
    ::finally_(() => setTimeout(() => m.redraw(), 0));
}

let fullList;

export function signin(passphrase) {
  return call("list", { passphrase }).then((list) => {
    fullList = list;
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

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function filterList(list, filter) {
  const result = [];
  for (const file of list) {
    if (filter.test(file.name)) result.push(file);
    else if (file.children) {
      const children = filterList(file.children, filter);
      if (children.length) result.push({ ...file, children });
    }
  }
  return result;
}

export function search(rawQuery) {
  const query = rawQuery.trim();
  if (query) {
    const filter = new RegExp(escapeRegExp(query).replace(/\s+/g, ".*"), "i");
    const list = filterList(fullList, filter);
    store.setList(list);
  }
  else {
    store.setList(fullList);
  }
}
