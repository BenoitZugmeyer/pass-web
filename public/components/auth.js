"use strict";
var m = require("mithril");
var Component = require("../component");
var Actions = require("../actions");
var DomUtil = require("../dom-util");

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

module.exports = class Auth extends Component {

  constructor() {
    super();
    this.passphrase = m.prop("");
    this.error = m.prop();
    this.loading = m.prop(false);
  }

  submit() {
    this.loading(true);
    Actions.signin(this.passphrase())
      ::pu.finally(() => this.loading(false))
      ::pu.catch(this.error);
  }

  render() {
    return (
      m("form", { onsubmit: DomUtil.stop(::this.submit) }, [

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
