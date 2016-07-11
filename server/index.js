#!/usr/bin/env node
"use strict";

const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const parseArgs = require("minimist");
const bodyParser = require("body-parser");
const httpAuth = require("http-auth");
const promiseUtil = require("./promiseUtil");
const Keys = require("./Keys");
const log = require("./log");
const fileStat = promiseUtil.wrapCPS(fs.stat);
const fileRead = promiseUtil.wrapCPS(fs.readFile);
const directoryRead = promiseUtil.wrapCPS(fs.readdir);
const realpath = promiseUtil.wrapCPS(fs.realpath);

class InvalidParameter extends Error {}
class AuthError extends Error {}

const listDirectory = promiseUtil.wrapRun(function* (root, filter) {
  const files = yield directoryRead(root);

  const result = yield files.map(promiseUtil.wrapRun(function* (name) {
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

const getGPGId = promiseUtil.wrapRun(function* (rootPath) {
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

const auth = promiseUtil.wrapRun(function* (conf, requestPath, passphrase) {
  const gpgId = yield getGPGId(requestPath || conf.passwordStorePath);

  if (!(yield conf.keys.verify(gpgId, passphrase))) {
    throw new AuthError("Bad passphrase");
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
    return promiseUtil.wrapRun(function* (req, res, next) {
      try {
        const iterable = gen(req, res, next);
        if (iterable && iterable[Symbol.iterator]) yield* iterable;
      }
      catch (error) {
        log.debug(error);
        sendError(res, error);
      }
    });
  }

  const getSecurePath = promiseUtil.wrapRun(function* (requestPath) {
    try {
      if (!Array.isArray(requestPath)) return;
      if (requestPath.some((p) => typeof p !== "string")) return;

      const filePath = yield realpath(path.resolve(
        conf.passwordStorePath,
        path.join(...requestPath)
      ));

      // Make sure the path is inside passwordStorePath and isn't in a dotted directory/file
      if (validFilePath(path.relative(conf.passwordStorePath, filePath))) return filePath;
    }
    catch (e) {
      log.debug(e);
    }
  });

  router.use(wrap((req, res, next) => {
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

  if (conf.htpasswd) {
    const basicAuth = httpAuth.basic({
      realm: "Log in to pass-web interface",
      file: conf.htpasswd,
    });

    app.use(httpAuth.connect(basicAuth));
  }

  app.use(conf.urlBaseDir, express.static(path.join(__dirname, "..", "dist")));
  app.use(conf.urlBaseDir + "api", apiRouter(conf));

  const secureServer = Boolean(conf.key && conf.cert);
  let server;

  if (secureServer) {
    server = https.createServer({
      key: fs.readFileSync(conf.key),
      cert: fs.readFileSync(conf.cert),
    }, app);
  }
  else {
    if (conf.address !== "localhost" && conf.address !== "127.0.0.1") {
      log.warning`Serving on a non-local address in non-secure HTTP is highly discouraged.`;
    }
    server = http.createServer(app);
  }

  server.listen(conf.port, conf.address, function () {
    const address = this.address();
    const scheme = secureServer ? "https" : "http";
    log.info`Server listening on ${scheme}://${address.address}:${address.port}${conf.urlBaseDir}`;
  });

  return new Promise((resolve, reject) => {
    server.on("listening", resolve);
    server.on("error", reject);
  });
}

function printHelp() {
  process.stderr.write(
      `\
pass-web [OPTION]... PGPKEY...

Launch the HTTP server. The PGPKEY arguments are paths to the exported (armored, encrypted) pgp secret keys.

The server will use HTTPS only if the options --key and --cert are provided.

Options:

    -d, --debug
        log additional information, useful for debugging purposes

    -s STOREPATH, --store STOREPATH
        path of the password-store directory, defaults to ~/.password-store

    -p PORT, --port PORT
        port to use, defaults to 3000

    -a ADDRESS, --address ADDRESS
        address to use, defaults to 127.0.0.1

    -h, --help
        print this help and quit

    --version
        print the version and quit

    --url-base-dir URLBASEDIR
        url subdirectory being used to serve the app, defaults to /. For example, /pass-web for a server at https://example.com/pass-web

    --key KEY
        path to key file to use for SSL. If omitted, serves without SSL

    --cert CERT
        path to certificate file to use for SSL. If omitted, serves without SSL

    --htpasswd HTPASSWD
        htpasswd file to use for additional HTTP basic authentication. If omitted, no authentication will be used

Usage example to makes bash-compatible shells temporarily export gpg keys:

    pass-web -p 9082 <(gpg --export-secret-keys -a)
`);
}

function printVersion() {
  const pkg = require("../package.json");
  process.stdout.write(`${pkg.name} ${pkg.version}\n`);
}

promiseUtil.run(function* () {

  const args = parseArgs(process.argv, {
    alias: {
      debug:    [ "d" ],
      store:    [ "s" ],
      port:     [ "p" ],
      address:  [ "a" ],
      help:     [ "h" ],
    },
    boolean:  [ "debug" ],
  });

  if (args.help) {
    printHelp();
    return;
  }

  if (args.version) {
    printVersion();
    return;
  }

  const passwordStorePath = yield realpath(args.store || path.join(process.env.HOME, ".password-store"));
  const passwordStoreStat = yield fileStat(passwordStorePath);
  if (!passwordStoreStat.isDirectory()) throw new Error(`${passwordStorePath} is not a directory`);

  const keys = new Keys();
  yield args._.slice(2).map((key) => keys.addFromFile(key));

  log.setLevel(args.debug ? log.DEBUG : log.INFO);

  if (keys.isEmpty()) {
    log.error("No key added. Use pass-web --help for more information.");
    return;
  }

  const urlBaseDirArg = (args["url-base-dir"] || "").replace(/^\/+|\/+$/g, "");
  const urlBaseDir = urlBaseDirArg ? `/${urlBaseDirArg}/` : "/";

  yield launchApp({
    passwordStorePath,
    keys,
    port: args.port || 3000,
    address: args.address || "127.0.0.1",
    key: args.key || false,
    cert: args.cert || false,
    htpasswd: args.htpasswd || false,
    urlBaseDir,
  });
})
.catch(log.error);
