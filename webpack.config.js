// @flow

const readFileSync = require("fs").readFileSync;

const babelConfig = JSON.parse(readFileSync(".babelrc").toString());

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: babelConfig
        }
      }
    ]
  }
};
