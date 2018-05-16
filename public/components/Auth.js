

import { Component, h } from "preact"
import { signin } from "../actions"
import { stop } from "../domUtil"
import { catch_, finally_ } from "../promiseUtil"
import { base, marginSize } from "../css"

const ss = base.namespace("Auth").addRules({

  root: {
    textAlign: "center",
  },

  textField: {
    inherit: "textField",
    marginRight: marginSize,
    marginBottom: marginSize,
  },

  error: {
    inherit: "error",
    marginBottom: marginSize,
  },

})

export default class Auth extends Component {

  constructor() {
    super()
    this.state = {
      passphrase: "",
      error: null,
      loading: false,
    }

    this.submit = () => {
      this.setState({ loading: true })
      signin(this.state.passphrase)
      ::finally_(() => this.setState({ loading: false }))
      ::catch_((error) => this.setState({ error }))
    }
  }

  render(props, {error, passphrase, loading}) {
    return (
      <form class={ss("root")} onSubmit={stop(this.submit)}>
        {error && <div class={ss("error")}>Error: {error.message}</div>}
        <input
          class={ss("textField")}
          type="password"
          ref={(el) => {
            this.input = el
          }}
          onChange={(event) => this.setState({ passphrase: event.target.value })}
          value={passphrase} />
        <button class={ss("button")} disabled={loading}>
          Login
        </button>
        {process.env.NODE_ENV === "demo" && <div>Hint: the demo passphrase is &#39;demo&#39;.</div>}
      </form>
    )
  }

  focus() {
    this.input.focus()
  }
}
