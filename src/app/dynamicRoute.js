import React from 'react'
import PropTypes from 'prop-types'

export let dynamicRoutes = []

function preloadDynamicRoute (chunkName) {
  return function ({ isServer, webpackStats }) {
    if (isServer) {
      return Promise.resolve({
        chunkName,
        isDynamic: true
      })
    } else {
      // Create link href and append it to body?
      // GET STYLES OK!
      // const body = document.querySelector('head')
      // const scriptTag = document.createElement('script')
      //
      // scriptTag.setAttribute('type', 'text/javascript')
      // scriptTag.setAttribute('src', `/${webpackStats[chunkName]}`)
      // body.appendChild(scriptTag)

      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            chunkName,
            isDynamic: true
          })
        })
      })
    }
  }
}

export default function dynamicRoute (importModule, options) {
  if (!options.weakResolved) {
    throw new Error('In order to generate a dynamic route you must provide weakResolved option')
  }

  if (!options.chunkName) {
    throw new Error('In order to generate a dynamic route you must provide the same chunkName used in "import" statement')
  }

  const { weakResolved } = options
  const webpackModules = (typeof window !== 'undefined' && window.__webpack_modules__) || __webpack_modules__ // eslint-disable-warning
  const webpackRequire = (typeof window !== 'undefined' && window.__webpack_require__) || __webpack_require__ // eslint-disable-warning
  const preloadDynamicChunkRoute = preloadDynamicRoute(options.chunkName)


  if (webpackModules[weakResolved]) {
    const Component = webpackRequire(weakResolved).default

    Component.isDynamic = function () {
      return true
    }

    Component.preloadDynamicRoute = function ({ isServer, webpackStats }) {
      return preloadDynamicChunkRoute({ isServer, webpackStats })
    }

    return Component
  } else {
    let componentDidMountNotificationResolve = null
    const componentDidMountNotification = new Promise((resolve, reject) => {
      componentDidMountNotificationResolve = resolve
      let id = setTimeout(() => {
        clearTimeout(id);
        reject('Timed out in '+ 10000 + 'ms.')
      }, 10000)
    })

    class WebpackRouteChunk extends React.Component {
      static contextTypes = {
        importedModules: PropTypes.array,
        addImportedModule: PropTypes.func
      }

      static getOptions () {
        return options
      }

      static isDynamic () {
        return true
      }

      static preloadDynamicRoute ({ isServer, webpackStats }) {
        return preloadDynamicChunkRoute({ isServer, webpackStats })
      }

      static getComponentDidMountNotification () {
        return componentDidMountNotification
      }

      constructor (props, context) {
        super(props, context)

        this.state = {
          componentReady: false
        }
      }

      componentDidMount () {
        componentDidMountNotificationResolve({ didMount: true })
      }

      componentWillMount () {
        if (webpackModules[weakResolved]) {
          const Component = webpackRequire(weakResolved).default

          dynamicRoutes = [...dynamicRoutes, options.chunkName]

          if (!!Component.loadInitialProps) {
            WebpackRouteChunk.loadInitialProps = Component.loadInitialProps
          }

          this.setState({
            componentReady: true,
            Component
          })
        } else {
          importModule().then(module => {
            const Component = module.default

            if (!!Component.loadInitialProps) {
              WebpackRouteChunk.loadInitialProps = Component.loadInitialProps
            }

            this.setState({
              componentReady: true,
              Component
            })
          })
        }
      }

      render () {
        if (this.state.componentReady) {
          return (
            <this.state.Component {...this.props} />
          )
        } else {
          return null
        }
      }
    }

    return WebpackRouteChunk
  }
}


// import React from 'react'
//
// export let importedModules = []
//
// export default function dynamicRoute (importModule, options) {
//   if (!options.weakResolved) {
//     throw new Error('In order to generate a dynamic route you must provide weakResolved option')
//   }
//
//   if (!options.chunkName) {
//     throw new Error('In order to generate a dynamic route you must provide the same chunkName used in "import" statement')
//   }
//
//   const { weakResolved } = options
//   const webpackModules = (typeof window !== 'undefined' && window.__webpack_modules__) || __webpack_modules__ // eslint-disable-warning
//   const webpackRequire = (typeof window !== 'undefined' && window.__webpack_require__) || __webpack_require__ // eslint-disable-warning
//
//   if (webpackModules[weakResolved]) {
//     importedModules = [...importedModules, options.chunkName]
//     const Component = webpackRequire(weakResolved).default
//     return Component
//   } else {
//     class WebpackRouteChunk extends React.Component {
//       constructor (props) {
//         super(props)
//
//         this.state = {
//           componentReady: false
//         }
//       }
//
//       componentWillMount () {
//         importModule().then(module => {
//           const Component = module.default
//           this.setState({
//             componentReady: true,
//             Component
//           })
//         })
//       }
//
//       render () {
//         if (this.state.componentReady) {
//           return (
//             <this.state.Component {...this.props} />
//           )
//         } else {
//           return (
//             <h1>Loading...</h1>
//           )
//         }
//       }
//     }
//
//     return WebpackRouteChunk
//   }
// }
