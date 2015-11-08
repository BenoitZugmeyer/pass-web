import m from "mithril";
import Component from "../component";
import Store from "../store";
import Directory from "./directory";
import File from "./file";


const transitionDelay = 0.5; // second
const maxHeight = "400px";

export default class List extends Component {

  static styles = {
    root: {
      display: "flex",
      maxHeight,
    },

    column: {
      position: "relative",
      display: "inline-block",
      transition: `width ${transitionDelay}s`,
      verticalAlign: "top",
    },

    columnContent: {
      padding: "5px",
      overflowY: "auto",
      maxHeight,
      boxSizing: "border-box",
    },

    separator: {
      position: "absolute",
      left: "-1px",
      top: "5px",
      bottom: "5px",

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
        index && m("div", { ss: "separator" }),
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
            const remainingWidth = Math.max((fullWidth - 2 * columnWidth) / (columnCount - 2), 0);
            node.style.width = `${remainingWidth}px`;
          }
        });
      }

    };

    return (
      m("div", { ss: "root", config },
        renderColumn({ children: Store.list }, 0),
        renderPath.map((file, i) => renderColumn(file, i + 1)),
      )
    );
  }

}
