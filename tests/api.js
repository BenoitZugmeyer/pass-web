/*eslint-env jest*/
const path = require("path")
const fs = require("fs")
const { spawn } = require("child_process")
const tmp = require("tmp-promise")
const fetch = require("node-fetch")
const generateKey = require("./util/generateKey")

function pipePrefixed(input, output, prefix) {
  const buffers = []
  input.on("data", buffer => {
    let previousIndex = 0
    while (true) {
      const index = buffer.indexOf("\n", previousIndex) + 1
      if (index === 0) {
        buffers.push(buffer.slice(previousIndex))
        break
      }
      buffers.push(buffer.slice(previousIndex, index))
      process.stdout.write(prefix)
      process.stdout.write(Buffer.concat(buffers))
      buffers.length = 0
      previousIndex = index
    }
  })
}

function launchPassWeb(args) {
  return new Promise((resolve, reject) => {
    const p = spawn("node", [
      path.join(__dirname, "..", "server", "index.js"),
      ...args,
    ])
    let onClose
    let closePromise

    pipePrefixed(p.stdout, process.stdout, "[pass-web] ")
    pipePrefixed(p.stderr, process.stderr, "[pass-web] ")
    p.on("close", code => onClose(code))

    function close() {
      if (closePromise) return closePromise
      closePromise = new Promise((resolve, reject) => {
        // Close
        onClose = code => {
          if (code !== 0 && code !== null) {
            reject(new Error("pass-web has crashed"))
          } else {
            resolve()
          }
        }
        p.kill("SIGTERM")
      })
    }

    // Start
    onClose = code => {
      if (code !== 0 && code !== null) {
        reject(new Error("pass-web has crashed"))
      }
    }

    p.stderr.on("data", data => {
      const matched = /Server listening on (.*)/.exec(data)
      if (matched) {
        resolve({
          baseURL: matched[1],
          close,
        })
      }
    })
  })
}

function withPassWeb(args = []) {
  let tmpDir
  let passWeb
  beforeAll(async () => {
    tmpDir = await tmp.dir()
    const keyPath = path.join(tmpDir.path, "test.key")
    const storePath = path.join(tmpDir.path, "store")
    const { encrypt, privateKey } = await generateKey()
    fs.writeFileSync(keyPath, privateKey)
    fs.mkdirSync(storePath)
    fs.writeFileSync(path.join(storePath, ".gpg-id"), "user@example.com")
    fs.writeFileSync(path.join(storePath, "foo.gpg"), await encrypt("foo"))
    passWeb = await launchPassWeb(["-s", storePath, keyPath, ...args])
  })

  afterAll(async () => {
    if (passWeb) await passWeb.close()
    if (tmpDir) await tmpDir.cleanup()
  })

  return {
    fetch(path) {
      if (!passWeb) throw new Error("pass-web failed to initialize")
      return fetch(passWeb.baseURL + path)
    },
    fetchAPI(route, params) {
      if (!passWeb) throw new Error("pass-web failed to initialize")
      return fetch(`${passWeb.baseURL}api/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(params),
      }).then(response => response.json())
    },
  }
}

describe("static resources", () => {
  const { fetch } = withPassWeb()
  test("HTML entrypoint", async () => {
    const response = await fetch("/")
    expect(response.status).toBe(200)
    const body = await response.text()
    expect(body.includes("main.js")).toBe(true)
  })
})

describe("/api/list", () => {
  const { fetchAPI } = withPassWeb()

  test("Wrong argument provided", async () => {
    expect(await fetchAPI("list")).toEqual({
      error: { type: "InvalidParameter", message: "No passphrase" },
    })
  })

  test("Invalid passphrase", async () => {
    expect(await fetchAPI("list", { passphrase: "ab" })).toEqual({
      error: { message: "Bad passphrase", type: "AuthError" },
    })
  })

  test("Returns the list of the files", async () => {
    expect(await fetchAPI("list", { passphrase: "abc" })).toEqual([
      { name: "foo.gpg" },
    ])
  })
})

describe("/api/get", () => {
  const { fetchAPI } = withPassWeb()

  test("Wrong argument provided", async () => {
    expect(await fetchAPI("get", { passphrase: "abc" })).toEqual({
      error: { message: "Invalid path parameter", type: "InvalidParameter" },
    })
  })

  test("Invalid passphrase", async () => {
    expect(await fetchAPI("get", { passphrase: "ab" })).toEqual({
      error: { message: "Bad passphrase", type: "AuthError" },
    })
  })

  test("Get a raw file", async () => {
    expect(
      await fetchAPI("get", { passphrase: "abc", path: ["foo.gpg"] }),
    ).toEqual("foo")
  })
})
