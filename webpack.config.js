const path = require('path');
const fs = require("fs");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const babelConfig = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, ".babelrc"))
    .toString()
    .replace(/\/\/.+/g, "")
);


module.exports = {
  entry: ['./src/main.js'],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js?/,
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist'),
  },
  devServer: {
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "head"
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};