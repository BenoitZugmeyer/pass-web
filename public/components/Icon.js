import { h } from "preact";
import { base } from "../css";
import icons from "../icons.svg";

const ss = base.namespace("Icon").addRules({
  root: {
    verticalAlign: "middle",
    display: "inline-block",
  },
});

export default ({ name, style, ...props}) => (
  <img {...props} src={`${icons}#${name}`} class={ss("root", style)} />
);
