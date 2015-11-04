import m from "mithril";
import Component from "../component";
import Icon from "./icon";
import { stop } from "../dom-util";
import { marginSize } from "../css";

export default class Card extends Component {

  static styles = {
    root: {
      margin: "10px 0 0 0",
      borderRadius: marginSize,
      boxShadow: "0 0 3px rgba(0, 0, 0, 0.4)",
    },

    icon: {
      marginRight: marginSize,
    },

    header: {
      cursor: "pointer",
      padding: marginSize,
    },

    content: {
      borderTop: "1px solid #C9CDCE",
      padding: marginSize,
    },

  };

  constructor({ children, icon, title }) {
    super();
    this.children = children;
    this.title = title;
    this.icon = icon;
    this.open = m.prop(false);
  }

  toggle() {
    this.open(!this.open());
  }

  renderIcon() {
    if (typeof this.icon === "string") {
      return m.component(Icon, this.icon, { ss: this.getStyle("icon") });
    }

    return this.icon;
  }

  renderHeader() {
    return (
      m("div", {
        onclick: ::this.toggle,
        onmousedown: stop(),
        ss: "header",
      },
      this.renderIcon(),
      this.title)
    );
  }

  render() {
    return (
      m("div",
        {
          ss: "root",
        },
        this.renderHeader(),
        this.open() && m("div", { ss: "content" }, this.children),
      )
    );
  }

}

