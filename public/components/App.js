import { Component, h } from "preact"
import Auth from "./Auth"
import store from "../store"
import List from "./List"
import Search from "./Search"
import { logout, search } from "../actions"
import { stop } from "../domUtil"
import { base, marginSize } from "../css"

const ss = base.namespace("App").addRules({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",

    position: "relative",
    boxSizing: "border-box",

    height: "100vh",
    maxWidth: "40em",
    margin: "auto",
    padding: "12px",
  },

  header: {
    display: "flex",
    flexShrink: 0,
    justifyContent: "space-between",
    marginBottom: marginSize,
  },
})

export default class App extends Component {
  constructor() {
    super()
    this.state = { store }
    this.updateStore = () => this.setState({ store })
  }

  componentDidMount() {
    store.register(this.updateStore)
  }

  componentWillUnmount() {
    store.unregister(this.updateStore)
  }

  render(_, { store }) {
    const isNewlyLogged = !this.wasLogged && store.loggedIn
    this.wasLogged = store.loggedIn

    return (
      <div class={ss("root")}>
        {store.loggedIn && (
          <div class={ss("header")}>
            <Search onChange={search} focus={isNewlyLogged} />
            <button onClick={stop(logout)} class={ss("button")}>
              Logout
            </button>
          </div>
        )}
        {store.loggedIn && <List list={store.list} />}
        {!store.loggedIn && <Auth />}
      </div>
    )
  }

}
