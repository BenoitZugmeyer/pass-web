"use strict";

import m from "mithril";
import Component from "../component";
import { signin } from "../actions";
import { stop } from "../dom-util";
import { catch_, finally_ } from "../promise-util";

export default class Auth extends Component {

  static styles = {

    root: {
      alignSelf: "center",
      flex: "1",
      textAlign: "center",
    },

    textField: {
      inherit: "textField",
      marginRight: "10px",
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
      finally_(() => this.loading(false))
      catch_(this.error);
  }

  render() {
    return (
      m("form", { ss: "root", onsubmit: stop(::this.submit) }, [

        this.error() && m("div", "Error: ", this.error().message),

        m("input", {
          ss: "textField",
          type: "password",
          onchange: m.withAttr("value", this.passphrase),
          value: this.passphrase(),
        }),

        m("button", { ss: "button", disabled: this.loading() }, "Login"),

      ])
    );
  }
}
