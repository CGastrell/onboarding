'use strict'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var UglifyJsPlugin = require('webpack-uglify-js-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

var hotMiddlewareScript = 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true'

module.exports = {
  target: 'web',
  devtool: 'source-map',
  // devtool: 'eval-source-map',
  entry: {
    client: hotMiddlewareScript,
    // client: 'webpack-hot-middleware/client?reload=true',
    main: path.join(__dirname, 'src/app.js'),
    vendor: [ 'leaflet', 'leaflet-draw' ]
  },
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
  externals: {
    jquery: 'jQuery',
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  // devServer: {
  //   contentBase: path.join(__dirname, 'public'),
  //   port: 3001,
  //   hot: true,
  //   overlay: true,
  //   progress: true
  // },
  plugins: [
    // new BundleAnalyzerPlugin(),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js' }),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.$': 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    // new webpack.ProvidePlugin({
    //   React: 'React',
    //   react: 'React',
    //   'window.react': 'React',
    //   'window.React': 'React'
    // }),
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
        query: JSON.stringify({ presets: [ 'react', [ 'es2015', { modules: false } ], 'stage-0', 'env' ] })
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
