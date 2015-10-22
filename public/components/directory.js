var m = require("mithril");
var Component = require("../component");
var File = require("./file");
var Actions = require("../actions");
var DomUtil = require("../dom-util");

var colors = [
  "27AE60",
  "8E44AD",
  "F39C12",
  "C0392B",
];

module.exports = class Directory extends Component {

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
              onmousedown: DomUtil.stop(),
              style: Object.assign({
                cursor: "pointer",
                padding: "4px 5px",
              }, this.open() && {
                fontWeight: "bold",
              }),
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

};


