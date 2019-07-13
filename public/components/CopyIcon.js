import { h } from "preact"
import { copy } from "../selection"
import { base, marginSize } from "../css"

const ss = base.namespace("CopyIcon").addRules({
  root: {
    verticalAlign: "middle",
    display: "inline-block",
    cursor: "pointer",
    position: "relative",
    top: "-4px",
    margin: `0 ${marginSize}`,
  },
})

export default ({ content, style, ...attrs }) => (
  <svg
    {...attrs}
    class={ss("root", style)}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 20 20"
    onClick={() => copy(content)}
  >
    <title>Copy</title>
    <path
      d="M2 15H1V5h8v4h2v10H3V9h6"
      fill="none"
      stroke="#7F8C8D"
      fill-rule="evenodd"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
)
