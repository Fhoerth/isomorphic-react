import React from 'react'
import { Provider } from 'react-redux'
import { StaticRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import routes from '../config/routes'
import RouterLoader from './RouterLoader'
import configureStore from '../store/configureStore'

class ServerApp extends React.Component {
  render () {
    return (
      <Provider store={this.props.store}>
        <div key='main'>
          <RouterLoader store={this.props.store} initialProps={this.props.initialProps} routes={routes} />
        </div>
      </Provider>
    )
  }
}

export default ServerApp
