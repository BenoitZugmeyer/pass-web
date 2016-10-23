import m from "mithril";
import { get } from "../actions";
import CopyIcon from "./CopyIcon";
import { select, unselect } from "../selection";
import { finally_ } from "../promiseUtil";
import { base, marginSize } from "../css";

const ss = base.namespace("File").addRules({
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
});

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
                 className: ss("link"),
                 href: match[0],
                 target: "_blank",
               }, match[0]);
             });

renderer.add(/\S+@\S+/,
             (match) => {
               return m("a", {
                 className: ss("link"),
                 href: `mailto:${match[0]}`,
                 target: "_blank",
               }, match[0]);
             });

renderer.add(/^[A-Z].*?:/,
             (match) => m("strong", match[0]));

export default {

  controller({ path }) {
    this.content = m.prop("");
    this.error = m.prop(false);
    this.loading = m.prop(true);
    get(path)
      ::finally_(() => this.loading(false))
      .then(this.content, this.error);
  },

  renderLoaded(controller) {
    const lines = controller.content().split("\n");
    const passwordLine = lines[0];
    const rest = lines.slice(1).join("\n");
    let passwordLineElement;
    const selectPassword = () => select(passwordLineElement);

    return [
      m("div",
        passwordLine && m("span", {
          className: ss("passwordSelector"),
          onmouseover: selectPassword,
          onclick: selectPassword,
          onmouseout: unselect,
        }, [
          "\u2022".repeat(10),
          m("span", {
            className: ss("passwordLine"),
            config: (element) => {
              passwordLineElement = element;
            },
          }, passwordLine),
        ]),
        m.component(CopyIcon, { content: passwordLine }),
      ),
      m("div", { className: ss("rest") }, renderer.render(rest.trimRight())),
    ];
  },

  view(controller) {
    return (
      m("div", { className: ss("root") }, [
        controller.loading() ? m("div", "Loading...") :
        controller.error() ? m("div", { className: ss("error") }, "Error: ", controller.error().message) :
          this.renderLoaded(controller),
      ])
    );
  },

}
