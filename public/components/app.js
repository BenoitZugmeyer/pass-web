var m = require("mithril");
var Auth = require("./auth");
var Component = require("../component");
var Store = require("../store");
var List = require("./list");

module.exports = class App extends Component {

  render() {
    return (
      m("div", {
        style: {
          maxWidth: "40em",
          margin: "auto",
          position: "relative",
          backgroundColor: "#ECF0F1",
          padding: "10px",
        },
      }, Store.loggedIn ? m.component(List) : m.component(Auth))
    );
  }

};
