import m from "mithril";
import Component from "../component";
import Line from "./line";

export default class Directory extends Component {

  render({ children, activeChild, onActiveChildChanged=() => {} }) {
    return m("div", children.map((child) => {
      const isDirectory = child.children;
      return m.component(
        Line,
        {
          key: child.name,
          icon: isDirectory ? "directory" : "file",
          title: child.name,
          active: child === activeChild,
          onClick: () => onActiveChildChanged(child === activeChild ? null : child),
        }
      );
    }));
  }

}
