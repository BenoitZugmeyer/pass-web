import m from "mithril";
import Auth from "./Auth";
import Component from "../Component";
import store from "../store";
import List from "./List";
import Search from "./Search";
import { logout, search } from "../actions";
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

      height: "100vh",
      maxWidth: "40em",
      margin: "auto",
      padding: "12px",
    },

    header: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: marginSize,
    },
  };

  render() {
    return (
      m("div",
        { ss: "root" },
        store.loggedIn ? [
          m("div", { ss: "header" }, [
            m.component(Search, { onChange: search }),
            m("button", {
              onclick: stop(logout),
              ss: "button",
            }, "Logout"),
          ]),
          m.component(List, store.list),
        ] :
        m.component(Auth)
      )
    );
  }

}
