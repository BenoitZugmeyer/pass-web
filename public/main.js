var m = require("mithril");
var App = require("./components/app");

document.body.style.margin = 0;
document.body.style.fontFamily = "Helvetica, Arial, sans-serif";
document.body.style.fontSize = "14px";

m.module(document.body, App);
