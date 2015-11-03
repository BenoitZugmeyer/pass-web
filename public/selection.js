
let spaceElement;

export function emptyClipboard() {
  if (!spaceElement) {
    spaceElement = document.createElement("div");
    spaceElement.style.opacity = "0";
    spaceElement.style.position = "absolute";
    spaceElement.style.top = "0";
    spaceElement.textContent = ".";
    document.body.appendChild(spaceElement);
  }

  select(spaceElement);

  try {
    return document.execCommand('copy');
  }
  catch (e) {
    return false;
  }
  finally {
    unselect();
  }
}

export function select(element) {
  if (!element) return;
  unselect();
  var range = document.createRange();
  range.selectNode(element);
  window.getSelection().addRange(range);
}

export function unselect() {
  window.getSelection().removeAllRanges();
}
