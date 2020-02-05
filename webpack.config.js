const path = require('path');
const fs = require("fs");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const babelConfig = JSON.parse(
  fs
    .readFileSync(path.resolve(__dirname, ".babelrc"))
    .toString()
    .replace(/\/\/.+/g, "")
);


module.exports = {
  entry: ['./src/main.js'],
  output: {
    path: path.resolve(__dirname, 'docs'),
    filename: '[name].js'
  },

  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js?/,
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpg|gif|glb|ogg|mp3|mp4|wav|woff2|svg|webm)$/,
        use: {
          loader: "file-loader",
          options: {
            // move required assets to output dir and add a hash for cache busting
            name: "[path][name]-[hash].[ext]",
            // Make asset paths relative to /src
            context: path.join(__dirname, "src")
          }
        }
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.jsx' , '.scss'],
  },
  
  devServer: {
    hot: true,
    
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      inject: "head"
    }),
    new webpack.NamedModulesPlugin(),
    //new webpack.HotModuleReplacementPlugin(),
    // Extract required css and add a content hash.
    new MiniCssExtractPlugin({
      disable: false

    })
  ]
};