
function cleanupFalsy(root) {
  if (root.children) {
    root.children.forEach((child, i, children) => {
      if (child) cleanupFalsy(child);
      else children[i] = undefined;
    });
  }
  return root;
}

export default class Component {

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
        return cleanupFalsy(component.render());
      },
    });
    return this.view;
  }

}
