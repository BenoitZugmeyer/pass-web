import m from "mithril";
import { copy } from "../selection";
import { base, marginSize } from "../css";

const ss = base.namespace("CopyIcon").addRules({
  root: {
    verticalAlign: "middle",
    display: "inline-block",
    cursor: "pointer",
    position: "relative",
    top: "-4px",
    margin: `0 ${marginSize}`,
  },
});

export default {

  view(controller, { content, ...attrs }) {
    return m("svg", Object.assign(attrs, {
      className: ss("root", attrs.style),
      xmlns: "http://www.w3.org/2000/svg",
      width: "20",
      height: "20",
      viewBox: "0 0 20 20",
      onclick: () => copy(content),
    }), [
      m("title", "Copy"),
      m("path", {
        d: "M2 15H1V5h8v4h2v10H3V9h6",
        fill: "none",
        stroke: "#7F8C8D",
        "fill-rule": "evenodd",
        "stroke-width": "1.5",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      }),
    ]);
  },

}

