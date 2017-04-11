'use strict'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var UglifyJsPlugin = require('webpack-uglify-js-plugin')

module.exports = {
  target: 'web',
  devtool: 'source-map',
  // devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src/app.js')
  ],
  output: {
    path: path.join(__dirname, '/public/'),
    filename: '[name].js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ]
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'public'),
  //   port: 3001,
  //   hot: true,
  //   overlay: true,
  //   progress: true
  // },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ExtractTextPlugin('[name]-[local]-[hash:6].css'),
    new HtmlWebpackPlugin({
      template: 'src/template/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    // new UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: true
    //   }
    // }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: JSON.stringify({ presets: [ [ 'es2015', { modules: false } ], 'stage-0', 'env' ] })
      },
      {
        test: /\.(otf|eot|svg|ttf|woff)/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/[name]-[hash:6].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: 'images/[name]-[hash:6].[ext]'
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  }
}
