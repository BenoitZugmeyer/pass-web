import m from "mithril";
import Line from "./Line";

export default {

  view(controller, { children, activeChild, onActiveChildChanged=() => {} }) {

    children.sort((a, b) => {
      // Sort directories first
      if (Boolean(a.children) ^ Boolean(b.children)) return a.children ? -1 : 1;
      // Then sort by name
      return a.name < b.name ? -1 : 1;
    });

    return m("div", children.map((child) => {
      const isDirectory = child.children;
      return m.component(
        Line,
        {
          key: child.name,
          icon: isDirectory ? "directory" : "file",
          title: isDirectory ? child.name : child.name.slice(0, -4),
          active: child === activeChild,
          onClick: () => onActiveChildChanged(child === activeChild ? null : child),
        }
      );
    }));
  },

}
