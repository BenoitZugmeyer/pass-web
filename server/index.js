"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const parseArgs = require("minimist");
const bodyParser = require("body-parser");
const PromiseUtil = require("./promise-util");
const Keys = require("./keys");
const fileStat = PromiseUtil.wrapCPS(fs.stat);
const fileRead = PromiseUtil.wrapCPS(fs.readFile);
const directoryRead = PromiseUtil.wrapCPS(fs.readdir);

class InvalidParameter extends Error {}
class AuthError extends Error {}

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

const getGPGId = PromiseUtil.wrapRun(function* (rootPath) {
  const stat = yield fileStat(rootPath);

  if (stat.isDirectory()) {
    const gpgIdPath = path.resolve(rootPath, ".gpg-id");
    const gpgStat = yield fileStat(gpgIdPath);
    if (gpgStat.isFile()) {
      return (yield fileRead(gpgIdPath, { encoding: "utf-8" })).trim();
    }
  }

  const parentPath = path.resolve(rootPath, "..");
  if (rootPath === parentPath) throw new Error("No .gpg-id found");

  return getGPGId(parentPath);
});

const auth = PromiseUtil.wrapRun(function* (conf, passphrase) {
  const gpgId = yield getGPGId(conf.passwordStorePath);
  if (!conf.keys.has(gpgId)) {
    throw new AuthError(`Unknown secret key ${JSON.stringify(gpgId)}`);
  }

  if (!(yield conf.keys.verify(gpgId, passphrase))) {
    throw new AuthError(`Bad passphrase`);
  }

  return gpgId;
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
        if (conf.debug) console.log(error.stack);
        sendError(res, error);
      }
    });
  }

  router.use(wrap(function* (req, res, next) {
    if (!req.body) throw new InvalidParameter("No request body");
    if (!req.body.passphrase) throw new InvalidParameter("No passphrase");
    req.gpgId = yield auth(conf, req.body.passphrase);
    next();
  }));

  router.post("/list", wrap(function* (req, res) {
    res.json(yield listDirectory(conf.passwordStorePath, filterFiles));
  }));

  router.post("/get", wrap(function* (req, res) {
    if (!Array.isArray(req.body.path)) throw new InvalidParameter("path is required");
    if (req.body.path.some((p) => typeof p !== "string" || p.startsWith(".") || !p)) {
      throw new InvalidParameter("Invalid path parameter");
    }
    const filePath = path.resolve(conf.passwordStorePath,
                                  path.join.apply(path.join, req.body.path));
    const rawContent = yield fileRead(filePath);
    const content = yield conf.keys.decrypt(req.gpgId, rawContent)
    if (!content.length) throw new Error("Empty file");
    res.json(content[0].toString());
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
  boolean: [ "debug" ],
});

PromiseUtil.run(function* () {
  const passwordStorePath = args.store || path.join(process.env.HOME, ".password-store");
  const passwordStoreStat = yield fileStat(passwordStorePath);
  if (!passwordStoreStat.isDirectory()) throw new Error(`${passwordStorePath} is not a directory`);

  const keys = new Keys();
  yield args._.slice(2).map((key) => keys.addFromFile(key));

  launchApp({
    debug: args.debug,
    passwordStorePath,
    keys,
  });
})
.catch((e) => console.log(args.debug ? e.stack : e.message));
