var m = require("mithril");
var Component = require("../component");
var Store = require("../store");
var Actions = require("../actions");
var DomUtil = require("../dom-util");
var Directory = require("./directory");

module.exports = class List extends Component {

  render() {
    return (
      m("div", [
        m("div", {
          style: { textAlign: "right" },
        }, [
          m("button", {
            onclick: DomUtil.stop(Actions.logout),
            style: {
              verticalAlign: "middle",
            },
          }, "Logout"),
        ]),
        m.component(Directory, { file: { children: Store.list } }),
      ])
    );
  }

};

