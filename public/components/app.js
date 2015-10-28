import m from "mithril";
import Auth from "./auth";
import Component from "../component";
import Store from "../store";
import List from "./list";

export default class App extends Component {

  static styles = {
    root: {
      maxWidth: "40em",
      margin: "auto",
      position: "relative",
      backgroundColor: "#ECF0F1",
      padding: "10px",
    },
  };

  render() {
    return (
      m("div", { ss: "root" }, Store.loggedIn ? m.component(List) : m.component(Auth))
    );
  }

}
