const express = require('express')
const path = require('path')
const app = express()
const isProduction = process.env.NODE_ENV === 'production'

let webpackServerConfig = require('./__webpack__/server.config')
let webpackBrowserConfig = isProduction ? require('./__webpack__/client.config').prod : require('./__webpack__/client.config').dev

/**
 * Load custom webpack configs
 */
try {
  const customServerConfig = require('./webpack.server.config')
  webpackServerConfig = customServerConfig(webpackServerConfig)
} catch (e) {
  handleRequireError(e, 'Loading default server config!')
}

try {
  const customBrowserConfig = require('./webpack.client.config')
  webpackBrowserConfig = customBrowserConfig(webpackBrowserConfig, isProduction)
} catch (e) {
  handleRequireError(e, 'Loading default client config!')
}
/**
 * End loading custom webpack configs
 */

/**
 * Specify config for webpackDevMiddleware: It requires an array of both server & browser compilers.
 */
const config = [
  webpackBrowserConfig,
  webpackServerConfig
]

// console.log(config);

/**
 * Production Build
 */
if (process.argv.indexOf('--build') !== -1) {
  const webpack = require('webpack')
  const compiler = webpack(config)

  return compiler.run(function () {
    console.log('⚙️⚙️ Compilation Finished ⚙️⚙️');
  })
}

app.get('/ping', (req, res, next) => {
  res.json({
    ok: true,
    date: new Date()
  })
})

app.get('/index-description', (req, res, next) => {
  res.json({
    data: 'This is a description for index page, fetched from server.'
  })
})


if (isProduction) {

} else {
    let webpackAssets = {}
    const webpack = require('webpack')
    const webpackDevMiddleware = require('webpack-dev-middleware')
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackHotServerMiddleware = require('webpack-hot-server-middleware')
    const compiler = webpack(config)

    // Register compilers
    const serverCompiler = compiler.compilers.find(compiler => compiler.name === 'server')
    const clientCompiler = compiler.compilers.find(compiler => compiler.name === 'client')

    // Compilers hooks
    serverCompiler.plugin('emit', (compilation, callback) => {
      webpackAssets = Object.assign({}, webpackAssets, {
        processedTemplate: compilation.assets['__ssr-template__.html'].source()
      })
      callback()
    })

    // Register ssr-template express middleware.
    app.use((req, res, next) => {
      res.webpackAssets = webpackAssets
      next()
    })

    app.use(express.static(path.join(__dirname, 'build')))
    app.use(webpackDevMiddleware(compiler, {
      serverSideRender: true,
      stats: {
        colors: true
      }
    }))
    app.use(webpackHotMiddleware(clientCompiler))
    app.use(webpackHotServerMiddleware(compiler))
}

app.listen(9000, function () {
  console.log(`
    🌎 Ready on http://0.0.0.0:9000

    ⚙️  NODE_ENV = ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}
  `)
})
