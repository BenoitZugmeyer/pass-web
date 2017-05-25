"use strict"

const wrapCPS = (fn, options) => {
  if (typeof fn !== "function") throw new Error("fn is not a function")

  return function () {
    const args = Array.from(arguments)
    return new Promise((resolve, reject) => {
      args.push(function () {
        const resultArgs = Array.from(arguments)
        const error = options && options.noError ? null : resultArgs.shift()

        if (error) reject(error)
        else if (options && options.multi) {
          const result = {}
          for (let i = 0; i < options.multi.length; i++) {
            result[options.multi[i]] = resultArgs[i]
          }
          resolve(result)
        }
        else resolve(resultArgs[0])
      })
      fn(...args)
    })
  }
}

module.exports = {
  wrapCPS,
}
