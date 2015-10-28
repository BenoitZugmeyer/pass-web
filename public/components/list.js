import m from "mithril";
import Component from "../component";
import Store from "../store";
import { logout } from "../actions";
import { stop } from "../dom-util";
import Directory from "./directory";

export default class List extends Component {

  static styles = {
    root: {
      flex: "1",
    },
    header: {
      textAlign: "right",
    },
  };

  render() {
    return (
      m("div", { ss: "root" }, [
        m("div", { ss: "header" }, [
          m("button", {
            onclick: stop(logout),
            ss: "button",
          }, "Logout"),
        ]),
        m.component(Directory, { file: { children: Store.list } }),
      ])
    );
  }

}
