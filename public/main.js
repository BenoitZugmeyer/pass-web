import { render, h } from "preact";
import App from "./components/App";
import { init as initFavicon } from "./favicon";
import { signin } from "./actions";

document.body.style.margin = 0;
document.body.style.fontFamily = "Helvetica, Arial, sans-serif";
document.body.style.fontSize = "14px";

initFavicon();

render(<App />, document.body);

signin("test")
