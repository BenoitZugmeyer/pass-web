import m from "mithril";
import { get } from "../actions";
import Component from "../component";
import { select, unselect } from "../selection";
import { finally_ } from "../promise-util";
import { marginSize } from "../css";


class Renderer {

  constructor() {
    this._renderers = [];
    this._re = null;
  }

  add(re, fn) {
    this._renderers.push({ re, fn });
    this._re = null;
  }

  render(text) {
    let re = this._re;
    if (!re) {
      this._re = re = new RegExp(
        this._renderers.map(({ re }) => `(${re.source})`).join("|"),
        "gm"
      );
    }

    const result = [];

    while (true) {
      const lastIndex = re.lastIndex;
      const match = re.exec(text);

      if (!match) {
        result.push(text.slice(lastIndex));
        break;
      }

      let rendererIndex = 0;
      for (; match[rendererIndex + 1] === undefined; rendererIndex += 1);

      result.push(
        text.slice(lastIndex, match.index),
        this._renderers[rendererIndex].fn(match),
      );
    }

    return result;
  }

}

const renderer = new Renderer();

renderer.add(/\bhttps?:\/\/\S+/,
             (match) => {
               return m("a", {
                 ss: "link",
                 href: match[0],
                 target: "_blank",
               }, match[0]);
             });

renderer.add(/\S+@\S+/,
             (match) => {
               return m("a", {
                 ss: "link",
                 href: `mailto:${match[0]}`,
                 target: "_blank",
               }, match[0]);
             });

renderer.add(/^[A-Z].*?:/,
             (match) => m("strong", match[0]));

export default class File extends Component {

  static styles = {
    root: {
      overflow: "hidden",
    },

    passwordSelector: {
      display: "inline-block",
      position: "relative",
      lineHeight: "24px",
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
      fontSize: "1000px",
    },

    rest: {
      whiteSpace: "pre",
      lineHeight: "24px",
    },

    button: {
      inherit: "button",

      marginLeft: marginSize,
    },

    link: {
      color: "#2C3E50",
      textDecoration: "none",
      hover: {
        textDecoration: "underline",
      },
    },
  };

  constructor({ path }) {
    super();
    this.content = m.prop("");
    this.error = m.prop(false);
    this.loading = m.prop(true);
    get(path)
      // TODO use this when https://github.com/babel/babel/issues/2942 is fixed/released
      //::finally_(() => this.loading(false))
      ::finally_(this.loading.bind(this, false))
      .then(this.content, this.error);
  }

  selectPassword() {
    select(this.passwordLineElement);
  }

  unselectPassword() {
    unselect();
  }

  renderLoaded() {
    const lines = this.content().split("\n");
    const passwordLine = lines[0];
    const rest = lines.slice(1).join("\n");

    return [
      m("div",
        m("span", {
          ss: "passwordSelector",
          onmouseover: ::this.selectPassword,
          onclick: ::this.selectPassword,
          onmouseout: ::this.unselectPassword,
        }, [
          "\u2022".repeat(10),
          m("span", {
            ss: "passwordLine",
            config: (element) => {
              this.passwordLineElement = element;
            },
          }, passwordLine),
        ]),
      ),
      m("div", { ss: "rest" }, renderer.render(rest.trimRight())),
    ];
  }

  render() {
    return (
      m("div", { ss: "root" }, [
        this.loading() ? m("div", "Loading...") :
        this.error() ? m("div", { ss: "error" }, "Error: ", this.error().message) :
          this.renderLoaded(),
      ])
    );
  }

}
