"use strict"

const runIterator = (iterator) =>
  new Promise((resolve, reject) => {
    const iterate = (next, value) => {
      let ret
      try {
        ret = next ? iterator.next(value) : iterator.throw(value)
      }
      catch (error) {
        reject(error)
        return
      }

      if (ret.done) {
        resolve(ret.value)
        return
      }

      const promise = Array.isArray(ret.value) ?
        Promise.all(ret.value) :
        Promise.resolve(ret.value)
      promise.then(
        (value) => iterate(true, value),
        (error) => iterate(false, error)
      )
    }

    iterate(true)
  })

const run = (generator) => runIterator(generator())

const wrapRun = (generator) =>
  function () {
    return runIterator(generator.apply(this, arguments))
  }

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
  run,
  wrapRun,
}
