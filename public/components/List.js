import { h, Component } from "preact"
import Directory from "./Directory"
import File from "./File"
import { base, marginSize, borderRadius, boxShadow } from "../css"

const transitionDelay = 0.5 // second
const empty = {}
const ss = base.namespace("List").addRules({
  root: {
    display: "flex",
    borderRadius,
    backgroundColor: "#ECF0F1",
    boxShadow,
    overflow: "hidden",
  },

  container: {
    flex: "1",
    display: "flex",
    marginLeft: "-2px", // Hide left separator
  },

  column: {
    position: "relative",
    display: "flex",
    transition: `width ${transitionDelay}s`,
    verticalAlign: "top",
    overflow: "hidden",
  },

  columnContent: {
    flex: "1",
    padding: `${marginSize}`,
    paddingLeft: `calc(${marginSize} + 2px)`,
    overflowY: "auto",
    overflowX: "hidden",
    boxSizing: "border-box",
  },

  separator: {
    position: "absolute",
    left: "0",
    top: marginSize,
    bottom: marginSize,

    border: "1px solid #BDC3C7",
  },

  noResult: {
    inherit: "error",
    margin: marginSize,
  },
})

export default class List extends Component {
  constructor() {
    super()
    this.state = {
      path: [],
      previousPath: null,
    }

    this.setPath = newPath => {
      this.setState(({ path }) => ({
        previousPath: path.slice(),
        path: newPath,
      }))
    }
  }

  updatePath(list) {
    const path = this.state.path
    const findFileByName = (list, name) => {
      for (const file of list) {
        if (file.name === name) return file
      }
    }

    for (let i = 0; i < path.length; i += 1) {
      const newChild = findFileByName(list, path[i].name)
      if (newChild) {
        path[i] = newChild
        list = newChild.children
        if (!list) break
      } else {
        path.length = i
        break
      }
    }

    while (list && list.length === 1) {
      path.push(list[0])
      list = list[0].children
    }
  }

  adjustColumnWidths() {
    if (this.props.list.length === 0) return

    const columnWidth = 200
    const columnCount = this.state.path.length + 1
    const fullWidth = this.container.clientWidth
    const nodes = Array.from(this.container.childNodes)

    if (fullWidth > columnCount * columnWidth) {
      nodes.forEach((node, index) => {
        if (index >= columnCount) {
          // Shrink previous extra columns
          node.style.width = "0"
        } else if (index >= columnCount - 1) {
          // Last column fills the extra space
          const extraSpace = fullWidth - columnWidth * (columnCount - 1)
          node.style.width = `${extraSpace}px`
        } else {
          // Other columns have the default width
          node.style.width = `${columnWidth}px`
        }
      })
    } else {
      const remainingWidth = Math.max(
        (fullWidth - 2 * columnWidth) / (columnCount - 2),
        0,
      )

      nodes.forEach((node, index) => {
        if (index >= columnCount) {
          // Shrink previous extra columns
          node.style.width = "0"
        } else if (index >= columnCount - 2) {
          // Last two columns have the default width
          node.style.width = `${columnWidth}px`
        } else {
          // Shrink other columns to fill the remaining space
          node.style.width = `${remainingWidth}px`
        }
      })
    }
  }

  componentDidMount() {
    this.adjustColumnWidths()
  }

  componentDidUpdate() {
    this.adjustColumnWidths()
  }

  render({ list }, { path, previousPath }) {
    this.updatePath(list)

    const renderPath = path.slice()
    if (previousPath && previousPath.length > path.length) {
      const isSubpath = path[path.length - 1] === previousPath[path.length - 1]
      for (const child of previousPath.slice(path.length)) {
        renderPath.push(isSubpath ? child : empty)
      }
      clearTimeout(this.redrawTimer)
      this.redrawTimer = setTimeout(() => {
        this.setState({ previousPath: null })
      }, transitionDelay * 1000)
    }

    const renderColumn = (file, index) => {
      let children, width
      const columnPath = renderPath.slice(0, index)

      if (file.children) {
        children = (
          <Directory
            onActiveChildChanged={child => {
              if (!child) this.setPath(columnPath)
              else this.setPath([...columnPath, child])
            }}
            activeChild={path[index]}
          >
            {file.children}
          </Directory>
        )
      } else if (file !== empty) {
        children = <File path={columnPath.map(f => f.name)} />
      }

      if (previousPath && index > previousPath.length) {
        // New column, starts with an empty width
        width = "0"
      }

      return (
        <div class={ss("column")} style={{ width }}>
          <div class={ss("separator")} />
          <div class={ss("columnContent")} key={file.name}>
            {children}
          </div>
        </div>
      )
    }

    return (
      <div class={ss("root")}>
        {list.length ? (
          <div class={ss("container")} ref={el => (this.container = el)}>
            {renderColumn({ children: list }, 0)}
            {renderPath.map((file, i) => renderColumn(file, i + 1))}
          </div>
        ) : (
          <div class={ss("noResult")}>No result</div>
        )}
      </div>
    )
  }
}
