import m from "mithril";
import Component from "../component";
import Store from "../store";
import { logout } from "../actions";
import { stop } from "../dom-util";
import Directory from "./directory";

export default class List extends Component {

  render() {
    return (
      m("div", [
        m("div", {
          style: { textAlign: "right" },
        }, [
          m("button", {
            onclick: stop(logout),
            style: {
              verticalAlign: "middle",
            },
          }, "Logout"),
        ]),
        m.component(Directory, { file: { children: Store.list } }),
      ])
    );
  }

}
