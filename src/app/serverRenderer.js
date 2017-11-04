/*
 * Server Side Rendering Webpack Entry Point
 */
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import Promise from 'bluebird'
import serialize from 'serialize-javascript'
import { flatten } from 'ramda'

import ServerApp from './ServerApp'
import loadInitialProps from './loadInitialProps'

import routes from '../config/routes'
import configureStore from '../store/configureStore'

const isProduction = process.env.NODE_ENV === 'production'

function replaceWebpackLinkRelExternals (template, styles) {
  return template.replace('{{__WEBPACK_LINK_REL_EXTERNALS__}}', styles.map(style => {
    return `<link href="/${style}" rel="stylesheet" type="text/css" async="true" />`
  }).join("\n"))
}

function replaceWebpackScriptExternals (template, scripts = []) {
  return template.replace('{{__WEBPACK_SCRIPT_EXTERNALS__}}', scripts.filter(s => s.includes('.js').map(script => {
    return flatten([script]).map(subScript => {
      return `<script type="text/javascript" src="/${subScript}"></script>`
    })
  }).join("\n"))
}

function replaceWebpackInlinedCss (template, css = []) {
  return template.replace('{{__WEBPACK_INLINED_CSS__}}', css.map(style => {
    return `<style type="text/css">${style}</style>`
  }).join("\n"))
}

function replaceWebpackInitialData (template, initialData = {}) {-
  return template.replace('{{__INITIAL_DATA__}}', serialize(initialData))
}

function replaceServerSideRenderedApp (template, app = '') {
  return template.replace('{{SSR}}', app)
}

export default function serverRenderer (stats, webpackAssets = null) {
  return (req, res, next) => {
    const StaticRouter = require('react-router').StaticRouter
    return Promise.try(() => {
      let template = (webpackAssets && webpackAssets.processedTemplate) || (res.webpackAssets && res.webpackAssets.processedTemplate)

      if (!template && !isProduction) {
        // When npm run dev command is executed and your enter the page, webpack will log in console
        // 'webpack: wait until bundle finished: /'
        // However, at this stage all values from res.webpackAssets will still be null because
        // webpack event 'emit' is fired after 'compilation' event which will cause response
        // to be rendered. At this point, we will want to reload the page for having webpackAssets to be fulfilled.
        return res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Reloading Webpack...</title>
              <script type="text/javascript">
                function refreshBrowser () {
                  window.location.reload()
                }

                if(window.addEventListener){
                  window.addEventListener('load', refreshBrowser)
                }else{
                  window.attachEvent('onload', refreshBrowser)
                }
              </script>
            </head>
            <body>
              <p>Reloading Webpack...</p>
            </body>
          </html>
        `)
      }

      const store = configureStore()

      const context = {}
      const location = req.url

      return loadInitialProps({ req, serverSideRendering: true, store, routes })
        .then(initialProps => {
          function ServerAppWithRouter () {
            return (
              <StaticRouter location={location} context={context}>
                <ServerApp store={store} initialProps={initialProps} />
              </StaticRouter>
            )
          }

          template = replaceServerSideRenderedApp(template, ReactDOMServer.renderToString(<ServerAppWithRouter />))
          template = replaceWebpackScriptExternals(template, [
            stats.clientStats.assetsByChunkName.vendor,
            stats.clientStats.assetsByChunkName.app
          ])
          template = replaceWebpackLinkRelExternals(template, [])
          template = replaceWebpackInlinedCss(template, [])
          template = replaceWebpackInitialData(template, {
            props: initialProps,
            state: store.getState()
          })

          res.send(template)
        })
    })
  }
}
