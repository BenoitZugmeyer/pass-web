export function finally_(fn) {
  return this.then(
    response => {
      fn()
      return response
    },
    error => {
      fn()
      throw error
    },
  )
}

export function catch_(fn) {
  return this.then(null, fn)
}
