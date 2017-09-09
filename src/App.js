import React from 'react'
import Promise from 'bluebird'

import { Provider } from 'react-redux'
import { withRouter } from 'react-router'
import { matchPath } from 'react-router-dom'
import { renderRoutes, matchRoutes } from 'react-router-config'
import { ConnectedRouter } from 'react-router-redux'

import routes from './config/routes'
import configureStore from './store/configureStore'

let clientApp = null
let clientStore = null

export class RouterLoader extends React.Component {
  constructor (props) {
    super(props)
    this.state = props.initialProps
  }

  componentWillReceiveProps (nextProps) {
    const hasToLoadInitialProps = nextProps.location.pathname !== this.props.location.pathname

    if (hasToLoadInitialProps) {
      const { store } = this.props

      loadInitialProps({ store, location }).then(initialProps => {
        const _loadInitialData = loadInitialData({ store, location })
        if (_loadInitialData) {
          this.setState(Object.assign({}, initialProps, {
            loadingInitialData: true
          }))
          _loadInitialData.then(() => {
            this.setState({
              loadingInitialData: false
            })
          })
        } else {
          this.setState(initialProps)
        }
      })
    }
  }

  render () {
    return (
      <div>{renderRoutes(this.props.routes, this.state)}</div>
    )
  }
}

export const RouterLoaderWithRouter = withRouter(RouterLoader)

export const createApp = (store, initialProps = {}) => () => {
  const BaseComponent = () => (
    <div key='main'>
      <RouterLoaderWithRouter store={store} initialProps={initialProps} routes={routes} />
    </div>
  )

  return (
    <Provider key='provider' store={store}>
      {store.history ? (
        <ConnectedRouter history={store.history} key='connected-router'>
          <BaseComponent />
        </ConnectedRouter>
      ) : (
        <BaseComponent />
      )}
    </Provider>
  )
}

export const loadInitialProps = ({ req = null, location = null, isServer = false, store }) => {
  const _location = (req && req.url) || (location && location.pathname) || '/'
  const branch = matchRoutes(routes, _location)

  const promises = branch.map(({ route, match }) => {
    return route.path && match.isExact && route.component.loadInitialProps ? route : null
  }).filter(
    x => x
  ).map(
    route => route.component.loadInitialProps({ req, isServer, store })
  )

  return promises.length ? promises[0] : Promise.resolve(null)
}

export const loadInitialData = ({ req = null, location = null, isServer = false, store }) => {
  const _location = (req && req.url) || (location && location.pathname) || '/'
  const branch = matchRoutes(routes, _location)

  const promises = branch.map(({ route, match }) => {
    return route.path && match.isExact && route.component.loadInitialData ? route : null
  }).filter(
    x => x
  ).map(
    route => route.component.loadInitialData({ req, isServer, store })
  )

  return promises.length ? promises[0] : null
}

export const client = () => {
  if (!clientApp) {
    clientStore = require('./store/clientStore').default

    // Load initial props from window
    const initialProps = (window.__INITIAL_DATA__ && window.__INITIAL_DATA__.props) || {}
    clientApp = createApp(clientStore, initialProps)
  }

  return clientApp
}

export const server = req => {
  const StaticRouter = require('react-router').StaticRouter

  return Promise.try(() => {
    const store = configureStore()

    const location = req.url
    const context = {}

    return loadInitialProps({ req, serverSideRendering: true, store })
      .then(initialProps => {
        const _loadInitialData = loadInitialData({ req, serverSideRendering: true, store})
        return (_loadInitialData && _loadInitialData.then(initialData => ({ initialProps, initialData }))) || Promise.resolve(null)

      }).then(({ initialProps, initialData }) => {
        const CreatedApp = createApp(store, initialProps)
        const App = (
          <StaticRouter location={location} context={context}>
            <CreatedApp />
          </StaticRouter>
        )

        return { App, store, initialProps }
      })
  })
}
