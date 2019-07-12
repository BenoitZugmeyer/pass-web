#!/usr/bin/env node
"use strict"

const fs = require("fs")
const path = require("path")
const parseArgs = require("minimist")
const { launchApp } = require("./app")
const promiseUtil = require("./promiseUtil")
const Keys = require("./Keys")
const log = require("./log")
const fileStat = promiseUtil.wrapCPS(fs.stat)
const realpath = promiseUtil.wrapCPS(fs.realpath)

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
`,
  )
}

function printVersion() {
  const pkg = require("../package.json")
  process.stdout.write(`${pkg.name} ${pkg.version}\n`)
}

;(async () => {
  const args = parseArgs(process.argv, {
    alias: {
      debug: ["d"],
      store: ["s"],
      port: ["p"],
      address: ["a"],
      help: ["h"],
    },
    boolean: ["debug"],
  })

  if (args.help) {
    printHelp()
    return
  }

  if (args.version) {
    printVersion()
    return
  }

  const passwordStorePath = await realpath(
    args.store || path.join(process.env.HOME, ".password-store"),
  )
  const passwordStoreStat = await fileStat(passwordStorePath)
  if (!passwordStoreStat.isDirectory())
    throw new Error(`${passwordStorePath} is not a directory`)

  const keys = new Keys()
  await Promise.all(args._.slice(2).map(key => keys.addFromFile(key)))

  log.setLevel(args.debug ? log.DEBUG : log.INFO)

  if (keys.isEmpty()) {
    log.error("No key added. Use pass-web --help for more information.")
    return
  }

  const urlBaseDirArg = (args["url-base-dir"] || "").replace(/^\/+|\/+$/g, "")
  const urlBaseDir = urlBaseDirArg ? `/${urlBaseDirArg}/` : "/"

  await launchApp({
    passwordStorePath,
    keys,
    port: args.port || 3000,
    address: args.address || "127.0.0.1",
    key: args.key || false,
    cert: args.cert || false,
    htpasswd: args.htpasswd || false,
    urlBaseDir,
  })
})().catch(log.error)
