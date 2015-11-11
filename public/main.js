import m from "mithril";
import App from "./components/App";

document.body.style.margin = 0;
document.body.style.fontFamily = "Helvetica, Arial, sans-serif";
document.body.style.fontSize = "14px";

m.module(document.body, App);
