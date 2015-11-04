import m from "mithril";
import Component from "../component";
import FileContent from "./file-content";
import Card from "./card";

export default class Directory extends Component {

  constructor({ file, parentPath=[] }) {
    super();
    this.file = file;
    this.path = parentPath.slice();
    this.path.push(file.name);
  }

  render() {
    var title = this.file.name;
    var index = title.lastIndexOf(".");
    if (index > 0) title = title.slice(0, index);

    return m.component(Card, {
      icon: "file",
      title,
      children: m.component(FileContent, { path: this.path }),
    });
  }

}
