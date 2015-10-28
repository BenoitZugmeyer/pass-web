import m from "mithril";
import Component from "../component";
import File from "./file";
import { stop } from "../dom-util";

var colors = [
  "27AE60",
  "8E44AD",
  "F39C12",
  "C0392B",
];

export default class Directory extends Component {

  static styles = {
    name: {
      cursor: "pointer",
      padding: "4px 5px",
    },

    nameOpen: {
      inherit: "name",
      fontWeight: "bold",
    },
  };

  constructor({ file, parentPath }) {
    super();
    this.file = file;
    if (parentPath) {
      this.path = parentPath.slice();
      this.path.push(file.name);
    }
    else {
      this.path = [];
    }
    this.open = m.prop(!parentPath);
  }

  toggle() {
    this.open(!this.open());
  }

  render() {
    var color = colors[this.path.length % colors.length];
    return (
        m("div", [
          this.path.length && m("div",
            {
              onclick: ::this.toggle,
              onmousedown: stop(),
              ss: this.open() ? "nameOpen" : "name",
            },
            this.file.name
          ),
          this.open() && m("div",
            {
              style: {
                borderLeft: `5px solid #${color}`,
              },
            },
            this.file.children.map((file) => {
              return m.component(
                file.children ? Directory : File,
                { key: file.name, file, parentPath: this.path }
              );
            })
          ),
        ])
    );
  }

}
