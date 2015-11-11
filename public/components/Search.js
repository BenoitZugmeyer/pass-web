import m from "mithril";
import Component from "../Component";
import { marginSize } from "../css";

export default class Search extends Component {

  static styles = {

    root: {
      display: "flex",
      flex: "1",
      maxWidth: "400px",
      marginRight: marginSize,
    },

    textField: {
      inherit: "textField",
      flex: "1",
    },

  };

  render({ onChange }) {
    let input;
    const triggerChange = () => {
      if (!onChange || !input) return;
      onChange(input.value);
    };
    return (
      m("div", { ss: "root" }, [
        m("input", {
          ss: "textField",
          config(el) {
            input = el;
          },
          onkeyup: triggerChange,
        }),
      ])
    );
  }
}
