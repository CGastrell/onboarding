var express = require('express')
var app = express()
var compression = require('compression')

var env = process.env['NODE_ENV']

if(env !== 'production') {
  var webpackConfig = require('./webpack.config.development')
  var webpack = require('webpack')
  var compiler = webpack(webpackConfig)
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: {
      colors: true
    }
  }))
  app.use(require('webpack-hot-middleware')(compiler))
}
app.use(compression())
app.use(express.static('public'))

app.listen(3000, function () {
  console.log('webpacking...')
})
