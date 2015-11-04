import m from "mithril";
import Component from "../component";
import File from "./file";
import Card from "./card";

export default class Directory extends Component {

  constructor({ file, parentPath=[] }) {
    super();
    this.file = file;
    this.path = parentPath.slice();
    this.path.push(file.name);
  }

  render() {
    return m.component(Card, {
      icon: "directory",
      title: this.file.name,
      children: this.file.children.map((file) => {
        return m.component(
          file.children ? Directory : File,
          { key: file.name, file, parentPath: this.path }
        );
      }),
    });
  }

}
