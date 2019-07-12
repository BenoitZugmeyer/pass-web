"use strict"
const https = require("https")
const http = require("http")
const path = require("path")
const fs = require("fs")
const express = require("express")
const httpAuth = require("http-auth")
const bodyParser = require("body-parser")
const log = require("./log")
const promiseUtil = require("./promiseUtil")
const fileStat = promiseUtil.wrapCPS(fs.stat)
const fileRead = promiseUtil.wrapCPS(fs.readFile)
const directoryRead = promiseUtil.wrapCPS(fs.readdir)
const realpath = promiseUtil.wrapCPS(fs.realpath)

class InvalidParameter extends Error {}
class AuthError extends Error {}

async function listDirectory(root, filter) {
  const files = await directoryRead(root)

  const result = await Promise.all(
    files.map(async name => {
      const filePath = path.join(root, name)
      const stat = await fileStat(filePath)
      if (!filter || filter(name, stat)) {
        return stat.isDirectory()
          ? {
              name,
              children: await listDirectory(filePath, filter),
            }
          : {
              name,
            }
      }
    }),
  )

  return result.filter(file => file)
}

function validDirectoryName(name) {
  return !name.startsWith(".")
}

function validFileName(name) {
  return !name.startsWith(".") && name.endsWith(".gpg")
}

function validFilePath(filePath) {
  const splitted = filePath.split(path.sep)
  return Boolean(
    splitted.length &&
      splitted.slice(0, -1).every(validDirectoryName) &&
      validFileName(splitted[splitted.length - 1]),
  )
}

function filterFiles(name, stat) {
  return stat.isDirectory()
    ? validDirectoryName(name)
    : stat.isFile()
    ? validFileName(name)
    : false
}

async function getGPGIds(rootPath) {
  const stat = await fileStat(rootPath)

  if (stat.isDirectory()) {
    const gpgIdPath = path.resolve(rootPath, ".gpg-id")
    let gpgStat
    try {
      gpgStat = await fileStat(gpgIdPath)
    } catch (e) {
      // Ignore ENOENT errors, just check for parent directory
      if (e.code !== "ENOENT") {
        log.error(e)
      }
    }
    if (gpgStat && gpgStat.isFile()) {
      return (await fileRead(gpgIdPath, { encoding: "utf-8" }))
        .split("\n")
        .map(id => id.trim())
        .filter(Boolean)
    }
  }

  const parentPath = path.resolve(rootPath, "..")
  if (rootPath === parentPath) throw new Error("No .gpg-id found")

  return getGPGIds(parentPath)
}

async function auth(conf, requestPath, passphrase) {
  const gpgIds = await getGPGIds(requestPath || conf.passwordStorePath)

  if (!(await conf.keys.verify(gpgIds, passphrase))) {
    throw new AuthError("Bad passphrase")
  }

  return gpgIds
}

function apiRouter(conf) {
  const router = express.Router()

  router.use(bodyParser.json())

  function sendError(res, error) {
    res.json({
      error: {
        type: error.constructor.name,
        message: error.message,
      },
    })
  }

  function wrap(gen) {
    return async (req, res, next) => {
      try {
        await gen(req, res, next)
      } catch (error) {
        log.debug(error)
        sendError(res, error)
      }
    }
  }

  async function getSecurePath(requestPath) {
    try {
      if (!Array.isArray(requestPath)) return
      if (requestPath.some(p => typeof p !== "string")) return

      const filePath = await realpath(
        path.resolve(conf.passwordStorePath, path.join(...requestPath)),
      )

      // Make sure the path is inside passwordStorePath and isn't in a dotted directory/file
      if (validFilePath(path.relative(conf.passwordStorePath, filePath)))
        return filePath
    } catch (e) {
      log.debug(e)
    }
  }

  router.use(
    wrap((req, res, next) => {
      if (!req.body) throw new InvalidParameter("No request body")
      if (!req.body.passphrase) throw new InvalidParameter("No passphrase")
      req.auth = requestPath => auth(conf, requestPath, req.body.passphrase)
      next()
    }),
  )

  router.post(
    "/list",
    wrap(async (req, res) => {
      await req.auth()
      res.json(await listDirectory(conf.passwordStorePath, filterFiles))
    }),
  )

  router.post(
    "/get",
    wrap(async (req, res) => {
      const filePath = await getSecurePath(req.body.path)

      // Always authenticate. We shouldn't throw any exception related to the file path before
      // authentication, as it could be a privacy leak (= an attacker could craft queries to check if
      // a file exists)
      await req.auth(filePath)

      if (!filePath) throw new InvalidParameter("Invalid path parameter")

      const rawContent = await fileRead(filePath)
      const content = await conf.keys.decrypt(rawContent, req.body.passphrase)
      if (!content.length) throw new Error("The file seems empty")
      res.json(content[0].toString("utf-8"))
    }),
  )

  return router
}

function launchApp(conf) {
  const app = createApp(conf)
  const secureServer = Boolean(conf.key && conf.cert)
  let server

  if (secureServer) {
    server = https.createServer(
      {
        key: fs.readFileSync(conf.key),
        cert: fs.readFileSync(conf.cert),
      },
      app,
    )
  } else {
    if (conf.address !== "localhost" && conf.address !== "127.0.0.1") {
      log.warning(
        "Serving on a non-local address in non-secure HTTP is highly discouraged.",
      )
    }
    server = http.createServer(app)
  }

  server.listen(conf.port, conf.address, function() {
    const address = this.address()
    const scheme = secureServer ? "https" : "http"
    log.info(
      `Server listening on ${scheme}://${address.address}:${address.port}${conf.urlBaseDir}`,
    )
  })

  return new Promise((resolve, reject) => {
    server.on("listening", resolve)
    server.on("error", reject)
  })
}

function createApp(conf) {
  const app = express()

  if (conf.htpasswd) {
    const basicAuth = httpAuth.basic({
      realm: "Log in to pass-web interface",
      file: conf.htpasswd,
    })

    app.use(httpAuth.connect(basicAuth))
  }

  app.use(conf.urlBaseDir, express.static(path.join(__dirname, "..", "dist")))
  app.use(`${conf.urlBaseDir}api`, apiRouter(conf))

  return app
}

module.exports = {
  createApp,
  launchApp,
}
