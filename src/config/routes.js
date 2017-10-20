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

export default routes
