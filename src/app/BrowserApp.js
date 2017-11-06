import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import routes from '../config/routes'
import RouterLoader from './RouterLoader'
import configureStore from '../store/configureStore'

class BrowserApp extends React.Component {
  constructor (props, context) {
    super(props, context)

    const initialProps = (window.__INITIAL_DATA__ && window.__INITIAL_DATA__.props) || {}
    const initialState = (window.__INITIAL_DATA__ && window.__INITIAL_DATA__.state) || {}
    const webpackStats = (window.__STATS__) || {}


    const store = configureStore(initialState)

    this.store = store
    this.initialProps = initialProps
    this.webpackStats = webpackStats
  }

  render () {
    return (
      <Provider store={this.store}>
        <BrowserRouter>
          <ConnectedRouter history={this.store.history} key='connected-router'>
            <div key='main'>
              <RouterLoader store={this.store} initialProps={this.initialProps} webpackStats={this.webpackStats} routes={routes} />
            </div>
          </ConnectedRouter>
        </BrowserRouter>
      </Provider>
    )
  }
}

export default BrowserApp
