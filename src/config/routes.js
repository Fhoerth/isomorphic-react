import React from 'react'
import PropTypes from 'prop-types'
import Promise from 'bluebird'

import { assoc } from 'ramda'
import { Route } from 'react-router'

import Document from '../pages/_document'
import Index from '../pages/index'
import About from '../pages/about'

const routes = [{
  component: Document,
  routes: [{
    path: '/',
    exact: true,
    component: Index
  }, {
    path: '/about',
    exact: true,
    component: About
  }]
}]

// function withRouterLoader (Component) {
//   class RouterLoader extends React.Component {
//     constructor (props) {
//       super(props)
//       this.state = props
//     }
//
//     componentWillReceiveProps (nextProps) {
//       const hasToLoadInitialProps = nextProps.location.pathname !== this.props.location.pathname
//
//       if (hasToLoadInitialProps) {
//         this.setState({
//           title: 'Gello',
//           isServer: false
//         })
//       }
//     }
//
//     render () {
//       const { children } = this.props
//       return (
//         <div><Component {...this.state} /></div>
//       )
//     }
//   }
//
//   RouterLoader.childContextTypes = {
//     store: PropTypes.object
//   }
//
//   return RouterLoader
// }

export default routes
