import m from "mithril";
import Auth from "./auth";
import Component from "../component";
import Store from "../store";
import List from "./list";
import { logout } from "../actions";
import { stop } from "../dom-util";
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
        Store.loggedIn ? [
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
