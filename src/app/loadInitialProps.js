import { matchRoutes } from 'react-router-config'

export default ({ req = null, location = null, isServer = false, store, routes }) => {
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
