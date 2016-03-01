import m from "mithril";
import Icon from "./Icon";
import { base, marginSize } from "../css";

const ss = base.namespace("Search").add({

    root: {
      position: "relative",
      flex: "1",
      maxWidth: "300px",
      marginRight: marginSize,
    },

    textField: {
      inherit: "textField",
      width: "100%",
      boxSizing: "border-box",
      paddingRight: `calc(20px + ${marginSize})`,
    },

    searchIcon: {
    },

    button: {
      pointerEvents: "none",
      position: "absolute",
      right: "0",
      top: "0",
      padding: `5px ${marginSize}`,
      cursor: "pointer",
    },

    buttonActive: {
      pointerEvents: "initial",
    },

});

export default {

  view(controller, { onChange, focus }) {
    const triggerChange = () => {
      if (!onChange || !this.input) return;
      onChange(this.input.value);
    };

    const emptyInput = () => {
      this.input.value = "";
      triggerChange();
    };

    const hasValue = Boolean(this.input && this.input.value);

    return (
      m("div", { className: ss.render("root") }, [
        m("input", {
          className: ss.render("textField"),
          config: (el) => {
            this.input = el;
            if (focus) el.focus();
          },
          onkeyup: triggerChange,
        }),
        m("div", { className: ss.render(["button", hasValue && "buttonActive" ]), onclick: emptyInput }, [
          m.component(Icon, hasValue ? "clean" : "search", { ss: ss.get("searchIcon") }),
        ]),
      ])
    );
  },

}
