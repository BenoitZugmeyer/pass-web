var m = require("mithril");
var Component = require("../component");
var FileContent = require("./file-content");
var DomUtil = require("../dom-util");

module.exports = class File extends Component {

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
            onmousedown: DomUtil.stop(),
            style: Object.assign({
              cursor: "pointer",
              padding: "4px 5px",
            }, this.open() && {
              backgroundColor: "#BDC3C7",
              fontWeight: "bold",
            }),
          },
          name
        ),
        this.open() && m.component(FileContent, { path: this.path }),
      ])
    );
  }

};
