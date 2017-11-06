import dynamicRoute from '../app/dynamicRoute'

require('../pages/dynamicPage')
const DynamicRouteComponent = dynamicRoute(() => new Promise((resolve) => {
    resolve(require('../pages/dynamicPage').default)
}), {
  weakResolved: require.resolveWeak('../pages/dynamicPage'),
  chunkName: 'dynamicPage'
})

export default DynamicRouteComponent
