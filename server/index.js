#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const express = require("express");
const parseArgs = require("minimist");
const bodyParser = require("body-parser");
const PromiseUtil = require("./promise-util");
const Keys = require("./keys");
const log = require("./log");
const fileStat = PromiseUtil.wrapCPS(fs.stat);
const fileRead = PromiseUtil.wrapCPS(fs.readFile);
const directoryRead = PromiseUtil.wrapCPS(fs.readdir);
const realpath = PromiseUtil.wrapCPS(fs.realpath);

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
        children: yield listDirectory(filePath, filter),
      } : {
        name,
      };
    }
  }));

  return result.filter((file) => file);
});


function validDirectoryName(name) {
  return !name.startsWith(".");
}

function validFileName(name) {
  return !name.startsWith(".") && name.endsWith(".gpg");
}

function validFilePath(filePath) {
  const splitted = filePath.split(path.sep);
  return Boolean(
    splitted.length &&
    splitted.slice(0, -1).every(validDirectoryName) &&
    validFileName(splitted[splitted.length - 1])
  );
}

function filterFiles(name, stat) {
  return (
    stat.isDirectory() ? validDirectoryName(name) :
    stat.isFile() ? validFileName(name) :
      false
  );
}

const getGPGId = PromiseUtil.wrapRun(function* (rootPath) {
  const stat = yield fileStat(rootPath);

  if (stat.isDirectory()) {
    const gpgIdPath = path.resolve(rootPath, ".gpg-id");
    let gpgStat;
    try {
      gpgStat = yield fileStat(gpgIdPath);
    }
    catch (e) {
      // Ignore ENOENT errors, just check for parent directory
      if (e.code !== "ENOENT") {
        log.error(e);
      }
    }
    if (gpgStat && gpgStat.isFile()) {
      return (yield fileRead(gpgIdPath, { encoding: "utf-8" })).trim();
    }
  }

  const parentPath = path.resolve(rootPath, "..");
  if (rootPath === parentPath) throw new Error("No .gpg-id found");

  return getGPGId(parentPath);
});

const auth = PromiseUtil.wrapRun(function* (conf, requestPath, passphrase) {
  const gpgId = yield getGPGId(requestPath || conf.passwordStorePath);

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
        log.debug(error);
        sendError(res, error);
      }
    });
  }

  const getSecurePath = PromiseUtil.wrapRun(function* (requestPath) {
    try {
      if (!Array.isArray(requestPath)) return;
      if (requestPath.some((p) => typeof p !== "string")) return;

      const filePath = yield realpath(path.resolve(
        conf.passwordStorePath,
        path.join.apply(path.join, requestPath)
      ));

      // Make sure the path is inside passwordStorePath and isn't in a dotted directory/file
      if (validFilePath(path.relative(conf.passwordStorePath, filePath))) return filePath;
    }
    catch (e) {
      log.debug(e);
    }
  });

  router.use(wrap(function* (req, res, next) {
    if (!req.body) throw new InvalidParameter("No request body");
    if (!req.body.passphrase) throw new InvalidParameter("No passphrase");
    req.auth = (requestPath) => auth(conf, requestPath, req.body.passphrase);
    next();
  }));

  router.post("/list", wrap(function* (req, res) {
    yield req.auth();
    res.json(yield listDirectory(conf.passwordStorePath, filterFiles));
  }));

  router.post("/get", wrap(function* (req, res) {

    const filePath = yield getSecurePath(req.body.path);

    // Always authenticate. We shouldn't throw any exception related to the file path before
    // authentication, as it could be a privacy leak (= an attacker could craft queries to check if
    // a file exists)
    yield req.auth(filePath);

    if (!filePath) throw new InvalidParameter("Invalid path parameter");

    const rawContent = yield fileRead(filePath);
    const content = yield conf.keys.decrypt(rawContent, req.body.passphrase);
    if (!content.length) throw new Error("The file seems empty");
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
    log.info`Server listening on http://${address.address}:${address.port}`;
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
  const passwordStorePath = yield realpath(args.store || path.join(process.env.HOME, ".password-store"));
  const passwordStoreStat = yield fileStat(passwordStorePath);
  if (!passwordStoreStat.isDirectory()) throw new Error(`${passwordStorePath} is not a directory`);

  const keys = new Keys();
  yield args._.slice(2).map((key) => keys.addFromFile(key));

  log.setLevel(args.debug ? log.DEBUG : log.INFO);

  launchApp({
    passwordStorePath,
    keys,
  });
})
.catch(log.error);
