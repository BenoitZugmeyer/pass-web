
import sansSel from "sans-sel";

const names = new Map();

function iterate(root, fn) {
  if (root.children) {
    root.children.forEach((child, i, children) => {
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
      borderRadius: "4px",
      border: "1px solid transparent",
      outline: 0,
    },

    textField: {
      inherit: "input",

      borderColor: "#BDC3C7",
      backgroundColor: "#fff",
    },

    button: {
      inherit: "input",

      color: "#fff",
      borderColor: "#16A085",
      backgroundColor: "#16A085",
      cursor: "pointer",

      hover: {
        backgroundColor: "#1ABC9C",
      },
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
        return new this(...args);
      },
    });
    return this.controller;
  }

  static get view() {
    Object.defineProperty(this, "view", {
      value(component) {
        const rendered = component.render();

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
    return ns.get.apply(ns, arguments);
  }

}



let style = document.createElement("style");
document.head.appendChild(style);

function tryRule(rule) {
  try {
    style.sheet.insertRule(rule, 0)
    return true;
  }
  catch (e) {
    return false;
  }
}

if (tryRule("::-moz-selection {}")) {
  Component.sansSelNS.transforms[':selection'] = (attr) => {
    return { ':-moz-selection': attr };
  };
}
else if (!tryRule("::selection {}")) {
  Component.sansSelNS.transforms[':selection'] = () => ({});
}

document.head.removeChild(style);
style = null;
