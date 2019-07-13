import { h, Component } from "preact"
import { get } from "../actions"
import CopyIcon from "./CopyIcon"
import { select, unselect } from "../selection"
import { finally_ } from "../promiseUtil"
import { base, marginSize } from "../css"

const ss = base.namespace("File").addRules({
  root: {
    overflow: "hidden",
  },

  passwordSelector: {
    display: "inline-block",
    position: "relative",
    lineHeight: "24px",
    hover: {
      backgroundColor: "#3498DB",
    },
  },

  passwordLine: {
    display: "block",
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    overflow: "hidden",
    color: "transparent",
    opacity: "0",
    fontSize: "1000px",
  },

  rest: {
    whiteSpace: "pre",
    lineHeight: "24px",
  },

  button: {
    inherit: "button",

    marginLeft: marginSize,
  },

  link: {
    color: "#2C3E50",
    textDecoration: "none",
    hover: {
      textDecoration: "underline",
    },
  },
})

class Renderer {
  constructor() {
    this._renderers = []
    this._re = null
  }

  add(re, fn) {
    this._renderers.push({ re, fn })
    this._re = null
  }

  render(text) {
    let re = this._re
    if (!re) {
      this._re = re = new RegExp(
        this._renderers.map(({ re }) => `(${re.source})`).join("|"),
        "gm",
      )
    }

    const result = []

    while (true) {
      const lastIndex = re.lastIndex
      const match = re.exec(text)

      if (!match) {
        result.push(text.slice(lastIndex))
        break
      }

      let rendererIndex = 0
      for (; match[rendererIndex + 1] === undefined; rendererIndex += 1);

      result.push(
        text.slice(lastIndex, match.index),
        this._renderers[rendererIndex].fn(match),
      )
    }

    return result
  }
}

const renderer = new Renderer()

renderer.add(/\bhttps?:\/\/\S+/, match => (
  <a class={ss("link")} href={match[0]} target="_blank">
    {match[0]}
  </a>
))

renderer.add(/\S+@\S+/, match => (
  <a class={ss("link")} href={`mailto:${match[0]}`} target="_blank">
    {match[0]}
  </a>
))

renderer.add(/^[A-Z].*?:/, match => <strong>{match[0]}</strong>)

export default class File extends Component {
  constructor({ path }) {
    super()
    this.state = {
      content: "",
      error: false,
      loading: true,
    }

    get(path)
      ::finally_(() => this.setState({ loading: false }))
      .then(
        content => this.setState({ content }),
        error => this.setState({ error }),
      )
  }

  renderLoaded(content) {
    const lines = content.split("\n")
    const passwordLine = lines[0]
    const rest = lines.slice(1).join("\n")
    let passwordLineElement
    const selectPassword = () => select(passwordLineElement)

    /*eslint-disable react/jsx-key*/
    return [
      <div>
        {" "}
        {passwordLine && (
          <span
            class={ss("passwordSelector")}
            onMouseOver={selectPassword}
            onClick={selectPassword}
            onMouseOut={unselect}
          >
            {"\u2022".repeat(10)}
            <span
              class={ss("passwordLine")}
              ref={el => (passwordLineElement = el)}
            >
              {passwordLine}
            </span>
          </span>
        )}
        <CopyIcon content={passwordLine} />
      </div>,
      <div class={ss("rest")}> {renderer.render(rest.trimRight())}</div>,
    ]
    /*eslint-enable react/jsx-key*/
  }

  render(_, { loading, error, content }) {
    return (
      <div class={ss("root")}>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div class={ss("error")}>Error: {error.message}</div>
        ) : (
          this.renderLoaded(content)
        )}
      </div>
    )
  }
}
