module.exports = {
  parser: "babel-eslint",

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "benoitz-prettier",
  ],

  rules: {
    "filenames/match-exported": "error",
    "react/no-unknown-property": "off",
    "react/prop-types": "off",
    "react/display-name": "off",
  },

  env: {
    node: true,
  },

  plugins: ["filenames", "react"],

  settings: {
    react: {
      pragma: "h",
    },
  },
}
