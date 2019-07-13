module.exports = {
  presets: [
    ["@babel/preset-env", { loose: true }],
    ["@babel/preset-react", { pragma: "h" }],
  ],
  plugins: [["@babel/plugin-proposal-function-bind"]],
}
