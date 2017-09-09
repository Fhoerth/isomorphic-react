import React from 'react'
import { Route, withRouter } from 'react-router'

class RouterLoaderComponent extends React.Component {
  render () {
    return (
      <Route
              render={() => children}
            />
    )
  }
}

export const RouterLoader = withRouter(RouterLoaderComponent)
