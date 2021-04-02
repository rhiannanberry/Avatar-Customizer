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
        test: /\.(js|jsx)$/,
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
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
            name: "images/[name].[ext]",
            // Make asset paths relative to /src
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