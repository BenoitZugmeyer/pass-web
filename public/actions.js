import m from "mithril";
import store from "./store";
import { finally_ } from "./promiseUtil";
import { emptyClipboard } from "./selection";

let request;

if (process.env.NODE_ENV === "demo") {
  const dd = (chunks, ...variables) => {
    let formated = "";

    for (let i = 0; i < chunks.length; i += 1) {
      formated += chunks[i]
      if (i < chunks.length - 1) formated += variables[i];
    }

    if (formated[0] === "\n") formated = formated.slice(1);

    const indent = formated.match(/([\t ]*)\S/);
    if (indent) {
      formated = formated.replace(new RegExp("^" + indent[1], "mg"), "");
    }

    return formated;
  };

  const passphrase = "demo";
  const files = {
    "Business": {
      "some-silly-business-site.com.gpg": dd`
        mypassword
        User name: mail@example.org`,
      "another-business-site.net.gpg": dd`
        somepassword`,
    },
    "Email": {
      "donenfeld.com.gpg": dd`
        emailpassword
        Address: me@donenfeld.com`,
      "zx2c4.com.gpg": dd`
        emailpassword
        Address: jean-michel@zx2c4.com`,
    },
    "France": {
      "bank.gpg": dd`
        bankpassword
        User name: me
        URL: https://mybank.org`,
      "freebox.gpg": "pwet",
      "mobilephone.gpg": dd`\n
        +33654235423`,
    },
  };

  const getFiles = (root=files) => {
    return Object.keys(root).map((name) => ({
      name,
      children: typeof root[name] === "object" && getFiles(root[name]),
    }));
  };

  const getFileContent = (path, root=files) => {
    const file = root[path[0]];
    if (path.length > 1) return getFileContent(path.slice(1), file);
    return file;
  };

  const error = (message) => ({ error: { message } });

  const getResponse = (route, data) => {
    if (data.passphrase !== passphrase) return error("Bad passphrase");
    if (route === "list") return getFiles();
    if (route === "get") return getFileContent(data.path);
    return error("Invalid route");
  };

  request = (route, data) => Promise.resolve(getResponse(route, data));
}
else {
  request = (route, data) => {
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
  };
}

function call(route, data) {
  return request(route, data)
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
