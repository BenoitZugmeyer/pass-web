"use strict";

import m from "mithril";
import Component from "../Component";
import { signin } from "../actions";
import { stop } from "../domUtil";
import { catch_, finally_ } from "../promiseUtil";
import { marginSize } from "../css";

export default class Auth extends Component {

  static styles = {

    root: {
      textAlign: "center",
    },

    textField: {
      inherit: "textField",
      marginRight: marginSize,
      marginBottom: marginSize,
    },

    error: {
      inherit: "error",
      marginBottom: marginSize,
    },

  };

  constructor() {
    super();
    this.passphrase = m.prop("");
    this.error = m.prop();
    this.loading = m.prop(false);
  }

  submit() {
    this.loading(true);
    signin(this.passphrase())
      ::finally_(() => this.loading(false))
      ::catch_(this.error);
  }

  render() {
    return (
      m("form", { ss: "root", onsubmit: stop(::this.submit) }, [

        this.error() && m("div", { ss: "error" }, "Error: ", this.error().message),

        m("input", {
          ss: "textField",
          type: "password",
          config(el) {
            el.focus();
          },
          onchange: m.withAttr("value", this.passphrase),
          value: this.passphrase(),
        }),

        m("button", { ss: "button", disabled: this.loading() }, "Login"),

        process.env.NODE_ENV === "demo" && m("div", "Hint: the demo passphrase is 'demo'."),
      ])
    );
  }
}
