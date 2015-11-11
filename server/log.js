"use strict";

const DEBUG = 1;
const INFO = 2;
const ERROR = 3;

let level = DEBUG;

function setLevel(level_) {
  level = level_;
}

function formatMessage(msg) {
  if (msg instanceof Error) return level <= DEBUG ? msg.stack : msg.message;
  return String(msg);
}

function makeLogger(level_) {
  return function (msg) {
    if (level_ >= level) {
      let result = "";
      if (Array.isArray(msg) && msg.raw) { // Template string
        for (let i = 0; i < msg.length; i++) {
          if (i) result += formatMessage(arguments[i]);
          result += msg[i];
        }
      }
      else {
        result = formatMessage(msg);
      }
      process.stderr.write(result);
      process.stderr.write("\n");
    }
  }
}

module.exports = {
  setLevel,
  debug: makeLogger(DEBUG),
  info: makeLogger(INFO),
  error: makeLogger(ERROR),
  DEBUG,
  INFO,
  ERROR,
};
