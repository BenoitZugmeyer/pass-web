"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const parseArgs = require("minimist");
const bodyParser = require("body-parser");
const gpg = require("gpg");
const PromiseUtil = require("./promise-util");
const fileStat = PromiseUtil.wrapCPS(fs.stat);
const fileRead = PromiseUtil.wrapCPS(fs.readFile);
const directoryRead = PromiseUtil.wrapCPS(fs.readdir);
const clearsign = PromiseUtil.wrapCPS(gpg.clearsign);

class InvalidParameter extends Error {}
class GPGError extends Error {
  constructor(error) {
    const message = error.message
    .replace(/^gpg:\s*/, "")
.replace(/\n.*/g, "");
super(message);
  }
}

const listDirectory = PromiseUtil.wrapRun(function* (root, filter) {
  const files = yield directoryRead(root);

  const result = yield files.map(PromiseUtil.wrapRun(function* (name) {
    const filePath = path.join(root, name);
    const stat = yield fileStat(filePath);
    if (!filter || filter(name, stat)) {
      return stat.isDirectory() ? {
        name,
        children: yield listDirectory(filePath),
      } : {
        name,
      };
    }
  }));

  return result.filter((file) => file);
});

function filterFiles(name, stat) {
  return (stat.isDirectory() && name !== ".git") || name.endsWith(".gpg");
}

const auth = PromiseUtil.wrapRun(function* (conf, passphrase) {
  try {
    yield clearsign("foo", ["--pinentry-mode", "loopback", "--passphrase", passphrase, "--quiet", "--local-user", conf.gpgId]);
  }
  catch (e) {
    throw new GPGError(e);
  }
});

function apiRouter(conf) {
  const router = express.Router();

  router.use(bodyParser.json());

  function sendError(res, error) {
    res.json({
      error: {
        type: error.constructor.name,
        message: error.message,
      },
    });
  }

  function wrap(gen) {
    return PromiseUtil.wrapRun(function* (req, res, next) {
      try {
        yield* gen(req, res, next);
      }
      catch (error) {
        sendError(res, error);
      }
    });
  }

  router.use(wrap(function* (req, res, next) {
    if (!req.body) throw new InvalidParameter("No request body");
    if (!req.body.passphrase) throw new InvalidParameter("No passphrase");
    yield auth(conf, req.body.passphrase);
    next();
  }));

  router.post("/list", wrap(function* (req, res) {
    res.json(yield listDirectory(conf.passwordStorePath, filterFiles));
  }));

  return router;
}

function launchApp(conf) {
  const app = express();

  app.use(express.static(path.join(__dirname, "..", "dist")));
  app.use("/api", apiRouter(conf));

  app.listen(3000, "localhost", function () {
    const address = this.address();
    console.log(`Server listening on http://${address.address}:${address.port}`);
  });
}

const args = parseArgs(process.argv, {
  alias: {
    debug: [ "d" ],
    store: [ "s" ],
  },
});

PromiseUtil.run(function* () {
  const passwordStorePath = args.store || path.join(process.env.HOME, ".password-store");
  const passwordStoreStat = yield fileStat(passwordStorePath);
  if (!passwordStoreStat.isDirectory()) throw new Error(`${passwordStorePath} is not a directory`);

  const gpgId = yield fileRead(path.join(passwordStorePath, ".gpg-id"), { encoding: "utf-8" });

  launchApp({
    debug: args.debug,
    passwordStorePath,
    gpgId: gpgId.trim(),
  });
})
.catch((e) => console.log(args.debug ? e.stack : e.message));
