import ReactRouterRoute from 'react-router/Route'
import Nprogress from 'nprogress'

class Route extends ReactRouterRoute {
  componentWillReceiveProps (newProps) {
    if (newProps.loadingRoute) {
      Nprogress.start()
    } else {
      Nprogress.done()
    }
  }
}

export default Route
