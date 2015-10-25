import m from "mithril";
import { get } from "../actions";
import Component from "../component";
import { stop } from "../dom-util";

export default class FileContent extends Component {

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
      m("div", {
        style: {
          margin: "0 0 0 5px",
          overflow: "hidden",
          backgroundColor: "#BDC3C7",
          marginBottom: "5px",
        },
      }, [
        m("div", {
          style: {
            padding: "4px 5px",
          },
        }, [
          this.error() ?
            m("div", {
              style: {
                color: "#C0392B",
                fontWeight: "bold",
              },
            }, "Error: ", this.error().message) :
            m("div", [
              m("span", {
                style: {
                  backgroundColor: "#2C3E50",
                  color: "#2C3E50",
                  textShadow: "0 0 10px #2C3E50",
                  display: "inline-block",
                },
                config: (element) => { this.firstLineElement = element; },
              }, firstLine),
              m("button", {
                style: {
                  marginLeft: "5px",
                },
                onclick: stop(::this.copy),
              }, "copy"),
            ]),
            rest,
          ]),
      ])
    );
  }

}
