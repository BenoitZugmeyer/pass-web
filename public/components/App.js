import m from "mithril";
import Auth from "./Auth";
import store from "../store";
import List from "./List";
import Search from "./Search";
import { logout, search } from "../actions";
import { stop } from "../domUtil";
import { base, marginSize } from "../css";

const ss = base.namespace("App").add({
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
});

export default {

  view(controller) {
    const isNewlyLogged = !controller.wasLogged && store.loggedIn;
    controller.wasLogged = store.loggedIn;

    return (
      m("div",
        { className: ss.render("root") },
        store.loggedIn ? [
          m("div", { className: ss.render("header") }, [
            m.component(Search, { onChange: search, focus: isNewlyLogged }),
            m("button", {
              onclick: stop(logout),
              className: ss.render("button"),
            }, "Logout"),
          ]),
          m.component(List, store.list),
        ] :
        m.component(Auth)
      )
    );
  },

}
