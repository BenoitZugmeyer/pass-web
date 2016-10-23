import m from "mithril";
import { base } from "../css";
import icons from "../icons.svg";

const ss = base.namespace("Icon").addRules({
  root: {
    verticalAlign: "middle",
    display: "inline-block",
  },
});

export default {

  view(controller, name, attrs) {
    return m("img", Object.assign({}, attrs, {
      src: `${icons}#${name}`,
      className: ss("root", attrs.style),
    }));
  },

}
