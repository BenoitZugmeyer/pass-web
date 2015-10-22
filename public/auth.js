"use strict";
var m = require("mithril");
function stop(fn) {
  return (...args) => {
    if (args[0] instanceof Event) args.shift().preventDefault();
    fn(...args);
  }
}

var pu = {

  finally(fn) {
    return this.then(
      (response) => {
        fn();
        return response;
      },
      (error) => {
        fn();
        throw error;
      }
    );
  },

  catch(fn) {
    return this.then(null, fn);
  },

}

class Controller {

  constructor(options) {
    this.passphrase = m.prop("");
    this.error = m.prop();
    this.loading = m.prop(false);
    this.onAuth = options && options.onAuth || () => {};
  }

  submit() {
    console.log("submit");
    this.loading(true);
    m.redraw();
    m.request({ method: "POST", url: "/api/list", data: { passphrase: this.passphrase() } })
    ::pu.finally(() => this.loading(false))
    .then((result) => {
      if (result.error) { throw new Error(result.error.message); }
      this.onAuth();
    })
    ::pu.catch(this.error);
  }

  render() {
    console.log(this.loading());
    return (
      m("form", { onsubmit: stop(::this.submit) }, [
        this.error() && m("div", "Error: ", this.error().message),
        m("input", {
          type: "password",
          onchange: m.withAttr("value", this.passphrase),
          value: this.passphrase(),
        }),
        m("button", { disabled: this.loading() }, "Login"),
      ])
    );
  }
}

module.exports = {
  controller: Controller,
  view(controller) {
    return controller.render();
  },
};
