
import sansSel from "sans-sel";
import { borderRadius, boxShadow } from "./css";

const names = new Map();

function iterate(root, fn) {
  let children = Array.isArray(root) ? root : root.children;
  if (children) {
    children.forEach((child, i, children) => {
      if (child) iterate(child, fn);
      fn(child, i, children);
    });
  }
}

export default class Component {

  static styles = {
    input: {
      font: "inherit",
      padding: "6px 12px",
      borderRadius,
      border: "1px solid transparent",
      boxShadow,
      outline: 0,
    },

    textField: {
      inherit: "input",

      backgroundColor: "#fff",
    },

    button: {
      inherit: "input",

      color: "#fff",
      borderColor: "#27AE60",
      backgroundColor: "#27AE60",
      cursor: "pointer",

      hover: {
        backgroundColor: "#2ECC71",
      },
    },

    error: {
      color: "#C0392B",
      fontWeight: "bold",
    },

  };

  static get sansSelNS() {
    if (this.hasOwnProperty("_sansSelNS")) return this._sansSelNS;

    let name = this.name;
    if (names.has(name)) {
      let id = names.get(name) + 1;
      names.set(name, id);
      name = `${name}_${id}`;
    }
    else {
      names.set(name, 0);
    }

    let ss = (Object.getPrototypeOf(this).sansSelNS || sansSel()).namespace(name);
    Object.defineProperty(this, "_sansSelNS", { value: ss });

    if (this.styles) ss.addAll(this.styles);

    return ss;
  }

  static get controller() {
    Object.defineProperty(this, "controller", {
      value: (...args) => {
        const result = new this(...args);
        result.args = args;
        return result;
      },
    });
    return this.controller;
  }

  static get view() {
    Object.defineProperty(this, "view", {
      value(component, ...args) {
        const rendered = component.render(...args);

        const renderss = (child) => {
          if (child.tag && child.attrs && child.attrs.ss) {
            child.attrs.className = component.constructor.sansSelNS.render(child.attrs.ss);
            delete child.attrs.ss;
          }
        };

        iterate(rendered, (child, i, children) => {
          if (!child) children[i] = undefined;
          else renderss(child);
        });

        renderss(rendered);
        return rendered;
      },
    });
    return this.view;
  }

  getStyle() {
    const ns = this.constructor.sansSelNS;
    return ns.get(...arguments);
  }

}
