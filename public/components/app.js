import m from "mithril";
import Auth from "./auth";
import Component from "../component";
import Store from "../store";
import List from "./list";

export default class App extends Component {

  static styles = {
    root: {
      display: "flex",
      position: "relative",
      boxSizing: "border-box",

      minHeight: "100vh",
      maxWidth: "40em",
      margin: "auto",
      padding: "10px",

      backgroundColor: "#ECF0F1",
    },
  };

  render() {
    return (
      m("div", { ss: "root" }, Store.loggedIn ? m.component(List) : m.component(Auth))
    );
  }

}
