//https://medium.com/@apostolos/server-side-rendering-code-splitting-and-hot-reloading-with-react-router-v4-87239cfc172c
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const express = require('express')
const EventEmitter = require('events')
const compression = require('compression')
const serialize = require('serialize-javascript')
const ReactDOMServer = require('react-dom/server')
const webpackIsomorphicCompiler = require('webpack-isomorphic-compiler')
const isProduction = process.env.NODE_ENV === 'production'

let webpackServerConfig = require('./__webpack__/server.config')
let webpackClientConfig = isProduction ? require('./__webpack__/client.config').prod : require('./__webpack__/client.config').dev

function handleRequireError (e, message) {
  if (e.message.includes('Cannot find')) {
    console.warn(message)
  } else {
    console.log(e);
  }
}

try {
  const customServerConfig = require('./webpack.server.config')
  webpackServerConfig = customServerConfig(webpackServerConfig)
} catch (e) {
  handleRequireError(e, 'Loading default server config!')
}

try {
  const customClientConfig = require('./webpack.client.config')
  webpackClientConfig = customClientConfig(webpackClientConfig, isProduction)
} catch (e) {
  handleRequireError(e, 'Loading default client config!')
}

const clientCompiler = webpack(webpackClientConfig)
const serverCompiler = webpack(webpackServerConfig)

/**
 * PRODUCTION BUILD
 */
if (process.argv.indexOf('--build') !== -1) {
  const compiler = webpackIsomorphicCompiler(clientCompiler, serverCompiler)
  compiler.on('begin', () => console.log('Compilation started'))
    .on('end', (stats) => {
        console.log('Compilation finished successfully');
    })
    .on('error', (err) => {
        console.log('Compilation failed')
        console.log(err.message);
        console.log(err.stats.toString());
    })

  return compiler.run()
}

let webpackProcessedTemplate = null
let serverApp = null // <- Exported Module by webpack server (/src/App.js)

function getServerApp (res) {
  if (isProduction) {
    return serverApp
  } else {
    return res.locals.isomorphicCompilation.exports
  }
}

const app = express()
const appMediator = new EventEmitter()

if (isProduction) {
  app.use(compression({ threshold: 0 }))
  app.use(express.static(path.join(__dirname, 'build')))

  fs.readFile(path.resolve(__dirname, 'build', '__ssr-template__.html'), 'utf8', (err, stream) => {
    if (err) {
      throw new Error('You must run "npm run build" command before starting production server')
    }

    webpackProcessedTemplate = stream.toString()
    serverApp = require('./build/js/server.js')

    appMediator.emit('ready')
  })
} else {
  const webpack = require('webpack')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const webpackIsomorphicDevMiddleware = require('webpack-isomorphic-dev-middleware');

  const clientCompiler = webpack(webpackClientConfig)
  const serverCompiler = webpack(webpackServerConfig)

  clientCompiler.plugin('emit', (compilation, callback) => {
    webpackProcessedTemplate = compilation.assets['__ssr-template__.html'].source()
    callback()
  })

  clientCompiler.plugin('done', () => {
    appMediator.emit('ready')
  })

  app.use(webpackIsomorphicDevMiddleware(clientCompiler, serverCompiler, {
    memoryFs: true
  }))
  app.use(webpackHotMiddleware(clientCompiler))
}

appMediator.once('ready', () => {
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

  app.get('*', (req, res, next) => {
    getServerApp(res).getServerAppContext(req).then(({ App, store, initialProps }) => {
      const initialData = {
        props: initialProps,
        state: store.getState()
      }

      let template = webpackProcessedTemplate.replace('{{__INITIAL_DATA__}}', serialize(initialData))
      template = template.replace('{{SSR}}', ReactDOMServer.renderToString(App))

      res.send(template)
    }).catch(e => {
      console.log('E', e);
      next(e)
    })
  })

  app.listen(9000, function () {
    console.log(`
      🌎 Ready on http://0.0.0.0:9000

      ⚙️  NODE_ENV = ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}
    `)
  })
})


//
// const webpackServerCompiler = webpack(webpackServerConfig)
// const webpackClientCompiler = webpack


// if (isProduction) {
//   let webpackProcessedTemplate = null
//   app.use(compression({ threshold: 0 }))
//   app.use(express.static(path.join(__dirname, 'build')))
//
//   fs.readFile(path.resolve(__dirname, 'build', '__ssr-template__.html'), 'utf8', (err, stream) => {
//     if (err) {
//       throw new Error('You must run "npm run build" command before starting production server')
//     }
//
//     webpackProcessedTemplate = stream.toString()
//     const { server } = require('./build/js/server.js')
//
//     console.log(webpackProcessedTemplate);
//
//     app.get('*', (req, res, next) => {
//       server(req).then(({ App, store }) => {
//         res.send(webpackProcessedTemplate.replace('{{SSR}}', ReactDOMServer.renderToString(App)))
//       }).catch(e => setImmediate(() => next(e)))
//     })
//
//     app.listen(9000, function () {
//       console.log(`
//         🌎 Ready on http://0.0.0.0:9000
//
//         ⚙️  NODE_ENV = PRODUCTION
//       `)
//     })
//   })
//
// } else {
//   const webpack = require('webpack')
//   const webpackDevMiddleware = require('webpack-dev-middleware')
//   const webpackHotMiddleware = require('webpack-hot-middleware')
//   const webpackIsomorphicDevMiddleware = require('webpack-isomorphic-dev-middleware');
//   const webpackConfig = require('./__webpack__/dev.config')
//
//   let webpackProcessedTemplate = null
//   let webpackClientConfig = webpackConfig.client
//   let webpackServerConfig = webpackConfig.server
//
//   try {
//     const webpackDevConfig = require('./webpack.dev-config.js')
//     webpackClientConfig = webpackDevConfig(webpackClientConfig, true)
//     webpackServerConfig = webpackDevConfig(webpackServerConfig, false)
//   } catch (e) {
//     console.warn('Loading default webpack config. Create "webpack.dev-config.js" in root directory to override default config.')
//   }
//
//   // COMPILER
//   const clientCompiler = webpack(webpackClientConfig)
//   const serverCompiler = webpack(webpackServerConfig)
//   clientCompiler.plugin('emit', (compilation, callback) => {
//     webpackProcessedTemplate = compilation.assets['__ssr-template__.html']
//     callback()
//   })
//
//   app.use(webpackIsomorphicDevMiddleware(clientCompiler, serverCompiler))
//   app.use(webpackHotMiddleware(clientCompiler))
//
//   app.get('*', (req, res, next) => {
//     const { server } = res.locals.isomorphicCompilation.exports
//
//     server(req).then(({ App, store }) => {
//       res.send(webpackProcessedTemplate.source().replace('{{SSR}}', ReactDOMServer.renderToString(App)))
//     }).catch(e => setImmediate(() => next(e)))
//   })
//
//   app.listen(9000, function (e) {
//     console.log(`
//       🌎 Ready on http://0.0.0.0:9000
//
//       ⚙️  NODE_ENV = DEVELOPMENT
//     `)
//   })
// }
