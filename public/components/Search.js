import m from "mithril";
import Component from "../Component";
import Icon from "./Icon";
import { marginSize } from "../css";

export default class Search extends Component {

  static styles = {

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

  };

  render({ onChange, focus }) {
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
      m("div", { ss: "root" }, [
        m("input", {
          ss: "textField",
          config: (el) => {
            this.input = el;
            if (focus) el.focus();
          },
          onkeyup: triggerChange,
        }),
        m("div", { ss: ["button", hasValue && "buttonActive" ], onclick: emptyInput }, [
          m.component(Icon, hasValue ? "clean" : "search", { ss: this.getStyle("searchIcon") }),
        ]),
      ])
    );
  }
}
