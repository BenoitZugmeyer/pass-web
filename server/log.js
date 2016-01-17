"use strict";

const DEBUG = 1;
const INFO = 2;
const WARNING = 3;
const ERROR = 4;

let level = DEBUG;

function setLevel(level_) {
  level = level_;
}

function formatMessage(msg) {
  if (msg instanceof Error) return level <= DEBUG ? msg.stack : msg.message;
  return String(msg);
}

function makeLogger(levelLabel, level_) {
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
      process.stderr.write(`${levelLabel}: ${result}\n`);
    }
  }
}

module.exports = {
  setLevel,
  debug: makeLogger("DEBUG", DEBUG),
  info: makeLogger("INFO", INFO),
  warning: makeLogger("WARNING", WARNING),
  error: makeLogger("ERROR", ERROR),
  DEBUG,
  INFO,
  WARNING,
  ERROR,
};
