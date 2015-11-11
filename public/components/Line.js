import m from "mithril";
import Component from "../Component";
import Icon from "./Icon";
import { stop } from "../domUtil";
import { marginSize, borderRadius } from "../css";

const background = "236, 240, 241";
const activeBackground = "189, 195, 199";

export default class Line extends Component {

  static styles = {

    root: {
      position: "relative",
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      borderRadius,
      padding: `2px ${marginSize}`,
    },

    active: {
      backgroundColor: `rgb(${activeBackground})`,
    },

    icon: {
      marginRight: marginSize,
    },

    shadow: {
      position: "absolute",
      top: borderRadius,
      bottom: borderRadius,
      right: 0,
      width: marginSize,

      background: `linear-gradient(
        to right,
        rgba(${background}, 0) 0%,
        rgba(${background}, 1) 50%,
        rgba(${background}, 1) 100%
      )`,
    },

    activeShadow: {
      inherit: "shadow",

      background: `linear-gradient(
        to right,
        rgba(${activeBackground}, 0) 0%,
        rgba(${activeBackground}, 1) 50%,
        rgba(${activeBackground}, 1) 100%
      )`,
    },

  };

  renderIcon(icon) {
    if (typeof icon === "string") {
      return m.component(Icon, icon, { ss: this.getStyle("icon") });
    }

    return icon;
  }

  render({ title, icon, active=false, onClick=()=>{} }) {
    return (
      m("div",
        {
          ss: ["root", active && "active"],
          onmousedown: stop(),
          onclick: stop(onClick),
        },
        this.renderIcon(icon),
        title,
        m("div", { ss: active ? "activeShadow" : "shadow" })
      )
    );
  }

}
