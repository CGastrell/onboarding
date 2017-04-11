'use strict'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var UglifyJsPlugin = require('webpack-uglify-js-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  target: 'web',
  devtool: false,
  // devtool: 'eval-source-map',
  entry: [
    path.join(__dirname, 'src/app.js')
  ],
  output: {
    path: path.join(__dirname, '/public/'),
    filename: '[name]-[hash:6].js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ]
  },
  plugins: [
    // new BundleAnalyzerPlugin(),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    new ExtractTextPlugin('[name]-[hash:6].css'),
    new HtmlWebpackPlugin({
      template: 'src/template/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new UglifyJsPlugin({
      cacheFolder: '/tmp/',
      debug: false,
      sourceMap: false,
      mangle: true,
      compress: {
        screw_ie8: true,
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      },
      output: {
        comments: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
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
