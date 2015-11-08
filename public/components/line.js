import m from "mithril";
import Component from "../component";
import Icon from "./icon";
import { stop } from "../dom-util";
import { marginSize } from "../css";

export default class Line extends Component {

  static styles = {

    root: {
      cursor: "pointer",
      whiteSpace: "nowrap",
      overflow: "hidden",
      //textOverflow: "ellipsis",
    },

    active: {
      backgroundColor: "#BDC3C7",
    },

    icon: {
      marginRight: marginSize,
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
          onclick: stop(onClick),
        },
        this.renderIcon(icon),
        title,
      )
    );
  }

}
