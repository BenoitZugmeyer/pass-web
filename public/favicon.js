import store from "./store";
import faviconLocked from "./favicon.png";
import faviconUnlocked from "./favicon-unlocked.png";

function render() {
  const favicon = store.loggedIn ? faviconUnlocked : faviconLocked;
  document.querySelector("link[rel=icon]").setAttribute("href", favicon);
}

export function init() {
  store.register(render);
  render();
}
