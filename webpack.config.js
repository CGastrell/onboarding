'use strict'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var UglifyJsPlugin = require('webpack-uglify-js-plugin')

// only debugging
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

// GH-PAGES deployment
var publicPath = process.env['SITE'] === 'ghpages' ? '/onboarding/' : '/'
var filenameTemplate = process.env['SITE'] === 'ghpages' ? '[name]' : '[name]-[hash:6]'

module.exports = {
  target: 'web',
  devtool: false,
  // devtool: 'eval-source-map',
  entry: {
    main: './src/app.js',
    vendor: ['leaflet', 'leaflet-draw']
  },
  output: {
    path: path.join(__dirname, '/public/'),
    filename: filenameTemplate + '.js',
    publicPath: publicPath
  },
  resolve: {
    modules: [
      'node_modules',
      'src'
    ]
  },
  externals: {
    jquery: 'jQuery',
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    new BundleAnalyzerPlugin(),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    new ExtractTextPlugin(filenameTemplate + '.css'),
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
        options: {
          presets: [
            'react',
            [ 'es2015', { modules: false } ],
            'stage-0',
            'env'
          ]
        }
      },
      {
        test: /\.(otf|eot|svg|ttf|woff)/,
        loader: 'url-loader',
        query: {
          limit: 8192,
          name: 'fonts/' + filenameTemplate + '.[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'url-loader',
        query: {
          limit: 5000,
          name: 'images/' + filenameTemplate + '.[ext]'
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
