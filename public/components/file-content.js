import m from "mithril";
import { get } from "../actions";
import Component from "../component";
import { select, unselect } from "../selection";
import { finally_ } from "../promise-util";

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

    passwordSelector: {
      display: "inline-block",
      position: "relative",
      hover: {
        backgroundColor: "#3498DB",
      },
    },

    passwordLine: {
      display: "block",
      position: "absolute",
      top: "0",
      left: "0",
      right: "0",
      bottom: "0",
      overflow: "hidden",
      color: "transparent",
      opacity: "0",
    },

    button: {
      inherit: "button",

      marginLeft: "5px",
    },
  };

  constructor({ path }) {
    super();
    this.content = m.prop("");
    this.error = m.prop(false);
    this.loading = m.prop(true);
    get(path)
      ::finally_(() => this.loading(false))
      .then(this.content, this.error);
  }

  selectPassword() {
    select(this.passwordLineElement);
  }

  unselectPassword() {
    unselect();
  }

  renderLoaded() {
    var lines = this.content().split("\n");
    var passwordLine = lines[0];
    var rest = lines.slice(1).join("\n");

    return [
      m("span", {
        ss: "passwordSelector",
        onmouseover: ::this.selectPassword,
        onclick: ::this.selectPassword,
        onmouseout: ::this.unselectPassword,
      }, [
        "\u2022".repeat(10),
        m("span", {
          ss: "passwordLine",
          config: (element) => { this.passwordLineElement = element; },
        }, passwordLine),
      ]),
      rest,
    ];
  }

  render() {
    return (
      m("div", { ss: "root" }, [
        m("div", { ss: "wrapper" }, [
          this.loading() ? m("div", "Loading...") :
          this.error() ? m("div", { ss: "error" }, "Error: ", this.error().message) :
            this.renderLoaded(),
        ]),
      ])
    );
  }

}
