import React from 'react'
import Route from 'react-router/Route'
import { withRouter } from 'react-router'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'

import loadInitialProps from './loadInitialProps'
import loadInitialData from './loadInitialData'

class PendingNavDataLoader extends React.Component {
  constructor (props) {
    super(props)
    const { initialProps } = props

    this.state = initialProps
  }

  componentWillReceiveProps (nextProps) {
    const navigated = nextProps.location !== this.props.location
    const { store, routes } = this.props

    if (navigated) {
      this.setState({
        previousLocation: this.props.location
      })

      const { location } = nextProps
      return loadInitialProps({ store, location, routes }).then(initialProps => {
        return loadInitialData({ store, location, routes }).then(() => {
          this.setState({
            previousLocation: null,
            initialProps
          })
        })
      })
    }
  }

  render () {
    const { routes, children, location } = this.props
    const { previousLocation } = this.state

    return (
      <Route
        location={previousLocation || location}
        render={() => renderRoutes(routes, this.state)}
      />
    )
  }
}

export default withRouter(PendingNavDataLoader)
