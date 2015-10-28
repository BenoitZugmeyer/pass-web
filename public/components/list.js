import m from "mithril";
import Component from "../component";
import Store from "../store";
import { logout } from "../actions";
import { stop } from "../dom-util";
import Directory from "./directory";

export default class List extends Component {

  static styles = {
    header: {
      textAlign: "right",
    },
    button: {
      verticalAlign: "middle",
    },
  };

  render() {
    return (
      m("div", [
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
