import sansSel from "sans-sel"

export const marginSize = "6px"
export const borderRadius = "2px"
export const boxShadow = "0.5px 0.5px 3px rgba(0, 0, 0, 0.5)"
export const base = sansSel().addRules({

  input: {
    font: "inherit",
    padding: "6px 12px",
    borderRadius,
    border: "1px solid transparent",
    boxShadow,
    outline: 0,
  },

  textField: {
    inherit: "input",

    backgroundColor: "#fff",
  },

  button: {
    inherit: "input",

    color: "#fff",
    borderColor: "#27AE60",
    backgroundColor: "#27AE60",
    cursor: "pointer",

    hover: {
      backgroundColor: "#2ECC71",
    },
  },

  error: {
    color: "#C0392B",
    fontWeight: "bold",
  },

})
