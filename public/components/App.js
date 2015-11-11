import m from "mithril";
import Auth from "./Auth";
import Component from "../Component";
import store from "../store";
import List from "./List";
import { logout } from "../actions";
import { stop } from "../domUtil";
import { marginSize } from "../css";

export default class App extends Component {

  static styles = {
    root: {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",

      position: "relative",
      boxSizing: "border-box",

      minHeight: "100vh",
      maxWidth: "40em",
      margin: "auto",
      padding: "12px",
    },

    header: {
      textAlign: "right",
      marginBottom: marginSize,
    },
  };

  render() {
    return (
      m("div",
        { ss: "root" },
        store.loggedIn ? [
          m("div", { ss: "header" }, [
            m("button", {
              onclick: stop(logout),
              ss: "button",
            }, "Logout"),
          ]),
          m.component(List),
        ] :
        m.component(Auth)
      )
    );
  }

}
