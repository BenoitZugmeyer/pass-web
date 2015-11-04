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

  constructor(name, attrs={}) {
    super();
    this.name = name;
    this.attrs = attrs;
  }

  render() {
    console.log("RENDER");
    return m("img", Object.assign({}, this.attrs, {
      src: `${icons}#${this.name}`,
      ss: ["root", this.attrs.ss],
    }));
  }

}
