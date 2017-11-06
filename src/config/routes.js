import React from 'react'
import PropTypes from 'prop-types'
import Promise from 'bluebird'

import { assoc } from 'ramda'
import { Route } from 'react-router'

import Document from '../pages/_document'
import Index from '../pages/index'
import About from '../pages/about'

import dynamicRoute from '../app/dynamicRoute'

const Dynamic = dynamicRoute(() => import(
  /* webpackChunkName: "dynamicPage" */
  '../pages/dynamicPage'
), {
  weakResolved: require.resolveWeak('../pages/dynamicPage'),
  chunkName: 'dynamicPage'
})

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
  }
  , {
    path: '/dynamic',
    exact: true,
    component: Dynamic
  }
  ]
}]

export default routes
