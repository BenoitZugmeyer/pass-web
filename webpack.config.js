"use strict";
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin')

const getPath = (fullPath) => {
  const args = fullPath.split("/");
  args.unshift(__dirname);
  return path.resolve.apply(null, args);
};

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
      title: "Pass",
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|src\/data\.js/,
        loader: "babel",
        query: {
          stage: 0,
          cacheDirectory: true,
          loose: true,
        },
      },
    ],
  },
};

if (process.env.NODE_ENV === "production") {
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
