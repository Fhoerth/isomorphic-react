import { matchRoutes } from 'react-router-config'
import { flatten } from 'ramda'

export default ({ req = null, location = null, isServer = false, store, routes, webpackStats = {} }) => {
  console.log('WebpackStats (bootstrapRoute)', webpackStats);
  const _location = (req && req.url) || (location && location.pathname) || '/'
  const branch = matchRoutes(routes, _location)

  const promises = branch.map(({ route, match }) => {
    return route.path && match.isExact ? route : null
  }).filter(
    x => x
  ).map(
    route => {
      let promises = []

      const { component } = route
      const isRouteDynamic = !!(component.isDynamic && component.isDynamic())
      const routeHasToLoadInitialProps = !!component.loadInitialProps

      if (isRouteDynamic) {
        promises = [...promises, component.preloadDynamicRoute({ isServer, webpackStats })]
      } else {
        promises = [...promises, Promise.resolve({ })]
      }

      if (routeHasToLoadInitialProps) {
        promises = [...promises, component.loadInitialProps({ req, isServer, store })]
      } else {
        promises = [...promises, Promise.resolve({ })]
      }

      return promises
    }
  )

  return promises.length ? Promise.all(flatten(promises)).then(([preloadDynamicRouteResult, loadInitialPropsResult]) => {
    const isDynamic = !!preloadDynamicRouteResult.isDynamic
    return {
      isDynamic,
      initialProps: loadInitialPropsResult,
      chunkName: isDynamic ? preloadDynamicRouteResult.chunkName : null
    }
  }) : Promise.resolve(null)
}

// export default ({ req = null, location = null, isServer = false, store, routes }) => {
//   const _location = (req && req.url) || (location && location.pathname) || '/'
//   const branch = matchRoutes(routes, _location)
//
//   const promises = branch.map(({ route, match }) => {
//     return route.path && match.isExact && route.component.loadInitialProps ? route : null
//   }).filter(
//     x => x
//   ).map(
//     route => {
//       let promises = []
//       const isRouteDynamic = !!(route.component.isDynamic && route.component.isDynamic())
//
//       if (isRouteDynamic) {
//         console.log(route.component.getOptions());
//         promises = [...promises, component.preloadDynamicRoute()]
//       }
//
//       promises = [...promises, ]
//
//       return route.component.loadInitialProps({ req, isServer, store })
//     }
//   )
//
//   return promises.length ? promises[0] : Promise.resolve(null)
// }
