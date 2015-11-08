import m from "mithril";
import Component from "../component";
import icons from "../icons.svg";

export default class Icon extends Component {

  static styles = {
    root: {
      verticalAlign: "middle",
      display: "inline-block",
    },
  };

  render(name, attrs) {
    return m("img", Object.assign({}, attrs, {
      src: `${icons}#${name}`,
      ss: ["root", attrs.ss],
    }));
  }

}
