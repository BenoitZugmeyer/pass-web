"use strict";
/*eslint filenames/filenames: 0*/

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin")

const getPath = (fullPath) => {
  const args = fullPath.split("/");
  args.unshift(__dirname);
  return path.resolve(...args);
};

const svgoConfig = {};

let config = {
  context: getPath("public"),
  entry: [ "./main" ],
  output: {
    path: getPath("dist"),
    filename: "main.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      template: getPath("public/index.html"),
    }),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || ""),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel",
      },
      {
        test: /\.svg$/,
        loaders: [
          "file-loader?name=[path][name].[ext]?[hash]",
          "svgo-loader?" + JSON.stringify(svgoConfig),
        ],
      },
    ],
  },
};

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "demo") {
  config.plugins.push(
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    })
  );
}
else {
  config.devtool = "source-map";
}

module.exports = config;
