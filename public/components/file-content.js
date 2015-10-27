import m from "mithril";
import { get } from "../actions";
import Component from "../component";
import { stop } from "../dom-util";

export default class FileContent extends Component {

  static styles = {
    root: {
      margin: "0 0 0 5px",
      overflow: "hidden",
      backgroundColor: "#BDC3C7",
      marginBottom: "5px",
    },
    wrapper: {
      padding: "4px 5px",
    },
    error: {
      color: "#C0392B",
      fontWeight: "bold",
    },

    firstLine: {
      backgroundColor: "#2C3E50",
      color: "#2C3E50",
      display: "inline-block",
      ":selection": {
        color: "#0A60C9",
        // Chrome forces a semi-transparent background, this is a workaround
        backgroundColor: "rgba(10, 96, 201, 0.99)",
      },
    },

    button: {
      marginLeft: "5px",
    },
  };

  constructor({ path }) {
    super();
    this.content = m.prop("");
    this.error = m.prop(false);
    get(path)
    .then(this.content, this.error);
  }

  copy() {
    if (!this.firstLineElement) return;
    var range = document.createRange();
    range.selectNode(this.firstLineElement);
    window.getSelection().addRange(range);

    var successful = false;
    try {
      successful = document.execCommand('copy');
    } catch (e) {
      // Ignore error
    }
    // TODO handle successful

    window.getSelection().removeAllRanges();
  }

  render() {
    var lines = this.content().split("\n");
    var firstLine = lines[0];
    var rest = lines.slice(1).join("\n");

    return (
      m("div", { ss: "root" }, [
        m("div", { ss: "wrapper" }, [
          this.error() ?
            m("div", { ss: "error" }, "Error: ", this.error().message) :
            m("div", [
              m("span", {
                ss: "firstLine",
                config: (element) => { this.firstLineElement = element; },
              }, firstLine),
              m("button", {
                ss: "button",
                onclick: stop(::this.copy),
              }, "copy"),
            ]),
            rest,
          ]),
      ])
    );
  }

}
