import { h, Component } from "preact"
import Icon from "./Icon"
import { base, marginSize } from "../css"

const ss = base.namespace("Search").addRules({
  root: {
    position: "relative",
    flex: "1",
    maxWidth: "300px",
    marginRight: marginSize,
  },

  textField: {
    inherit: "textField",
    width: "100%",
    boxSizing: "border-box",
    paddingRight: `calc(20px + ${marginSize})`,
  },

  searchIcon: {},

  button: {
    pointerEvents: "none",
    position: "absolute",
    right: "0",
    top: "0",
    padding: `5px ${marginSize}`,
    cursor: "pointer",
  },

  buttonActive: {
    pointerEvents: "initial",
  },
})

export default class Search extends Component {
  render({ onChange }) {
    const triggerChange = () => {
      if (!onChange || !this.input) return
      onChange(this.input.value)
    }

    const emptyInput = () => {
      this.input.value = ""
      triggerChange()
    }

    const hasValue = Boolean(this.input && this.input.value)

    return (
      <div class={ss("root")}>
        <input
          class={ss("textField")}
          ref={el => {
            this.input = el
          }}
          onKeyUp={triggerChange}
        />
        <div
          class={ss("button", hasValue && "buttonActive")}
          onClick={emptyInput}
        >
          <Icon name={hasValue ? "clean" : "search"} style={ss("searchIcon")} />
        </div>
      </div>
    )
  }

  focus() {
    this.input.focus()
  }
}
