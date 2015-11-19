import m from "mithril";
import Component from "../Component";
import Directory from "./Directory";
import File from "./File";
import { marginSize, borderRadius, boxShadow } from "../css";


const transitionDelay = 0.5; // second
const empty = {};

export default class List extends Component {

  static styles = {
    root: {
      display: "flex",
      borderRadius,
      backgroundColor: "#ECF0F1",
      boxShadow,
      overflow: "hidden",
    },

    container: {
      flex: "1",
      display: "flex",
      marginLeft: "-2px", // Hide left separator
    },

    column: {
      position: "relative",
      display: "flex",
      transition: `width ${transitionDelay}s`,
      verticalAlign: "top",
      overflow: "hidden",
    },

    columnContent: {
      flex: "1",
      padding: `${marginSize}`,
      paddingLeft: `calc(${marginSize} + 2px)`,
      overflowY: "auto",
      overflowX: "hidden",
      boxSizing: "border-box",
    },

    separator: {
      position: "absolute",
      left: "0",
      top: marginSize,
      bottom: marginSize,

      border: "1px solid #BDC3C7",
    },

    noResult: {
      inherit: "error",
      margin: marginSize,
    },

  };

  constructor() {
    super();
    this.path = [];
  }

  setPath(newPath) {
    this.previousPath = this.path.slice();
    this.path = newPath;
  }

  updatePath(list) {
    const findFileByName = (list, name) => {
      for (const file of list) {
        if (file.name === name) return file;
      }
    };

    for (let i = 0; i < this.path.length; i += 1) {
      const newChild = findFileByName(list, this.path[i].name);
      if (newChild) {
        this.path[i] = newChild;
        list = newChild.children;
        if (!list) break;
      }
      else {
        this.path.length = i;
        break;
      }
    }

    while (list && list.length === 1) {
      this.path.push(list[0]);
      list = list[0].children;
    }
  }

  render(list) {

    this.updatePath(list);

    const renderPath = this.path.slice();
    if (this.previousPath && this.previousPath.length > this.path.length) {
      const isSubpath = this.path[this.path.length - 1] === this.previousPath[this.path.length - 1];
      for (const child of this.previousPath.slice(this.path.length)) {
        renderPath.push(isSubpath ? child : empty);
      }
      clearTimeout(this.redrawTimer);
      this.redrawTimer = setTimeout(() => {
        this.previousPath = undefined;
        m.redraw();
      }, transitionDelay * 1000);
    }

    const renderColumn = (file, index) => {
      let children, width;
      const columnPath = renderPath.slice(0, index);

      if (file.children) {
        children = m.component(Directory, {
          children: file.children,
          onActiveChildChanged: (child) => {
            if (!child) this.setPath(columnPath);
            else this.setPath([...columnPath, child]);
          },
          activeChild: this.path[index],
        });
      }
      else if (file !== empty) {
        children = m.component(File, { path: columnPath.map((f) => f.name) });
      }

      if (this.previousPath && index > this.previousPath.length) {
        // New column, starts with an empty width
        width = "0";
      }

      return m("div", {
        ss: "column",
        style: { width },
      }, [
        m("div", { ss: "separator" }),
        m("div", {
          ss: "columnContent",
          key: file.name,
        }, children),
      ]);
    };

    const config = (element) => {

      const columnWidth = 200;
      const columnCount = this.path.length + 1;
      const fullWidth = element.clientWidth;
      const nodes = Array.from(element.childNodes);

      if (fullWidth > columnCount * columnWidth) {
        nodes.forEach((node, index) => {
          if (index >= columnCount) {
            // Shrink previous extra columns
            node.style.width = "0";
          }
          else if (index >= columnCount - 1) {
            // Last column fills the extra space
            const extraSpace = fullWidth - columnWidth * (columnCount - 1);
            node.style.width = `${extraSpace}px`;
          }
          else {
            // Other columns have the default width
            node.style.width = `${columnWidth}px`;
          }
        });
      }
      else {
        const remainingWidth = Math.max((fullWidth - 2 * columnWidth) / (columnCount - 2), 0);

        nodes.forEach((node, index) => {
          if (index >= columnCount) {
            // Shrink previous extra columns
            node.style.width = "0";
          }
          else if (index >= columnCount - 2) {
            // Last two columns have the default width
            node.style.width = `${columnWidth}px`;
          }
          else {
            // Shrink other columns to fill the remaining space
            node.style.width = `${remainingWidth}px`;
          }
        });
      }

    };

    return (
      m("div", { ss: "root" },
        list.length ?
          m("div", { ss: "container", config },
            renderColumn({ children: list }, 0),
            renderPath.map((file, i) => renderColumn(file, i + 1)),
          ) :
          m("div", { ss: "noResult" }, "No result"),
      )
    );
  }

}
