/*
 * Server Side Rendering Webpack Entry Point
 */
import React from 'react'
import Promise from 'bluebird'

import ServerApp from './ServerApp'
import loadInitialProps from './loadInitialProps'

import routes from '../config/routes'
import configureStore from '../store/configureStore'

function getServerAppContext (req) {
  const StaticRouter = require('react-router').StaticRouter

  return Promise.try(() => {
    const store = configureStore()

    const location = req.url
    const context = {}

    return loadInitialProps({ req, serverSideRendering: true, store, routes })
      .then(initialProps => {
        return {
          store,
          initialProps,
          App: (
            <StaticRouter location={location} context={context}>
              <ServerApp store={store} initialProps={initialProps} />
            </StaticRouter>
          )
        }
      })
  })
}

module.exports = {
  getServerAppContext
}
