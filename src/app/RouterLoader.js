import React from 'react'
import Route from './Route'
import { withRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import bootstrapRoute from './bootstrapRoute'

class RouterLoader extends React.Component {
  constructor (props, context) {
    super(props, context)
    const { initialProps } = props

    this.state = {
      initialProps
    }
  }

  componentWillReceiveProps (nextProps) {
    const navigated = nextProps.location.pathname !== this.props.location.pathname
    const { store, routes, webpackStats } = this.props

    if (navigated) {
      const { location } = nextProps

      this.setState({
        loadingRoute: true,
        previousLocation: this.props.location
      })

      return bootstrapRoute({ store, location, routes, isServer: false, webpackStats }).then(({ initialProps }) => {
        this.setState({
          loadingRoute: false,
          previousLocation: null,
          initialProps
        })
      }).catch(() => {
        this.setState({
          loadingRoute: false
        })
      })
    }
  }

  render () {
    const { routes, children, location } = this.props
    const { previousLocation, loadingRoute } = this.state

    return (
      <div key='route'>
        <Route
          loadingRoute={loadingRoute}
          previousLocation={previousLocation}
          location={previousLocation || location}
          render={() => renderRoutes(routes, { ...this.state.initialProps, loadingRoute })}
        />
      </div>
    )
  }
}

export default withRouter(RouterLoader)
