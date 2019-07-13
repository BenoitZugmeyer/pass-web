import { h } from "preact"
import Icon from "./Icon"
import { stop } from "../domUtil"
import { base, marginSize, borderRadius } from "../css"

const background = "236, 240, 241"
const activeBackground = "189, 195, 199"
const ss = base.namespace("Line").addRules({
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
})

export default ({ title, icon, active = false, onClick = () => {} }) => (
  <div
    class={ss("root", active && "active")}
    onMouseDown={stop()}
    onClick={stop(onClick)}
  >
    {typeof icon === "string" ? <Icon name={icon} style={ss("icon")} /> : icon}
    {title}
    <div class={ss(active ? "activeShadow" : "shadow")} />
  </div>
)
