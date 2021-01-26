const path = require('path');
const webpack = require('webpack');




const HtmlWebpackPlugin = require('html-webpack-plugin')




/*
 * We've enabled HtmlWebpackPlugin for you! This generates a html
 * page for you when you compile webpack, which will make you start
 * developing and prototyping faster.
 *
 * https://github.com/jantimon/html-webpack-plugin
 *
 */

const WorkboxWebpackPlugin = require('workbox-webpack-plugin');




module.exports = {
  mode: 'development',

  plugins: [new webpack.ProgressPlugin(), new HtmlWebpackPlugin({
            template: 'index.html'
          }), new WorkboxWebpackPlugin.GenerateSW({
          swDest: 'sw.js',
          clientsClaim: true,
          skipWaiting: false,
        })],

  module: {
    rules: [{
      test: /\.(js|jsx)$/,
      include: [path.resolve(__dirname, 'src')],
      loader: 'babel-loader'
    }, {
      test: /.css$/,

      use: [{
        loader: "style-loader"
      }, {
        loader: "css-loader",

        options: {
          sourceMap: true
        }
      }]
    }]
  },

  devServer: {
    open: true,
    host: 'localhost'
  }
}