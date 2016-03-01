"use strict";

import m from "mithril";
import { signin } from "../actions";
import { stop } from "../domUtil";
import { catch_, finally_ } from "../promiseUtil";
import { base, marginSize } from "../css";

const ss = base.namespace("Auth").add({

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

});

export default {

  controller() {
    this.passphrase = m.prop("");
    this.error = m.prop();
    this.loading = m.prop(false);
    this.submit = () => {
      this.loading(true);
      signin(this.passphrase())
        ::finally_(() => this.loading(false))
        ::catch_(this.error);
    };
  },

  view(controller) {
    return (
      m("form", { className: ss.render("root"), onsubmit: stop(controller.submit) }, [

        controller.error() && m("div", { className: ss.render("error") }, "Error: ", controller.error().message),

        m("input", {
          className: ss.render("textField"),
          type: "password",
          config(el) {
            el.focus();
          },
          onchange: m.withAttr("value", controller.passphrase),
          value: controller.passphrase(),
        }),

        m("button", { className: ss.render("button"), disabled: controller.loading() }, "Login"),

        process.env.NODE_ENV === "demo" && m("div", "Hint: the demo passphrase is 'demo'.") || "",
      ])
    );
  },
}
