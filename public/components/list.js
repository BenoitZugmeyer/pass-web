import m from "mithril";
import Component from "../component";
import Store from "../store";
import Directory from "./directory";
import File from "./file";
import { marginSize, borderRadius, boxShadow } from "../css";


const transitionDelay = 0.5; // second
const maxHeight = "400px";

export default class List extends Component {

  static styles = {
    root: {
      borderRadius,
      backgroundColor: "#ECF0F1",
      boxShadow,
      overflow: "hidden",
    },

    container: {
      display: "flex",
      maxHeight,
      marginLeft: "-2px", // Hide left separator
    },

    column: {
      position: "relative",
      display: "inline-block",
      transition: `width ${transitionDelay}s`,
      verticalAlign: "top",
      overflow: "hidden",
    },

    columnContent: {
      padding: `${marginSize}`,
      paddingLeft: `calc(${marginSize} + 2px)`,
      overflowY: "auto",
      overflowX: "hidden",
      maxHeight,
      boxSizing: "border-box",
    },

    separator: {
      position: "absolute",
      left: "0",
      top: marginSize,
      bottom: marginSize,

      border: "1px solid #BDC3C7",
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

  render() {

    var renderPath = this.path.slice();
    if (this.previousPath) {
      renderPath.push(...this.previousPath.slice(this.path.length));
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
      else {
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
        m("div", { ss: "container", config },
          renderColumn({ children: Store.list }, 0),
          renderPath.map((file, i) => renderColumn(file, i + 1)),
        )
      )
    );
  }

}
