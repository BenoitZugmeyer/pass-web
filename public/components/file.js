import m from "mithril";
import Component from "../component";
import FileContent from "./file-content";
import { stop } from "../dom-util";

export default class File extends Component {

  static styles = {

    name: {
      cursor: "pointer",
      padding: "4px 5px",
    },

    nameOpen: {
      inherit: "name",

      backgroundColor: "#BDC3C7",
      fontWeight: "bold",
    },

  };

  constructor({ file, parentPath }) {
    super();
    this.file = file;
    this.path = parentPath.slice();
    this.path.push(file.name);
    this.open = m.prop(false);
  }

  toggle() {
    this.open(!this.open());
  }

  render() {
    var name = this.file.name;
    var index = name.lastIndexOf(".");
    if (index > 0) name = name.slice(0, index);

    return (
      m("div", [
        m("div",
          {
            onclick: ::this.toggle,
            onmousedown: stop(),
            ss: this.open() ? "nameOpen" : "name",
          },
          name
        ),
        this.open() && m.component(FileContent, { path: this.path }),
      ])
    );
  }

}
