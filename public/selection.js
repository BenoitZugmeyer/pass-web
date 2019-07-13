let copyElement

export function copy(content) {
  if (!copyElement) {
    copyElement = document.createElement("div")
    copyElement.style.opacity = "0"
    copyElement.style.position = "absolute"
    copyElement.style.top = "0"
    document.body.appendChild(copyElement)
  }

  copyElement.textContent = content
  select(copyElement)

  try {
    return document.execCommand("copy")
  } catch (e) {
    return false
  } finally {
    unselect()
  }
}

export function emptyClipboard() {
  copy(".")
}

export function select(element) {
  if (!element) return
  unselect()
  const range = document.createRange()
  range.selectNode(element)
  window.getSelection().addRange(range)
}

export function unselect() {
  window.getSelection().removeAllRanges()
}
