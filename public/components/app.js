import m from "mithril";
import Auth from "./auth";
import Component from "../component";
import Store from "../store";
import List from "./list";

export default class App extends Component {

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

}
