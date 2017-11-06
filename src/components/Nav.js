import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

function Nav ({ home, about, size }) {
  return (
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/about'>About</Link></li>
      <li><Link to='/dynamic'>Dynamic</Link></li>
    </ul>
  )
}

export default connect(state => ({
  home: state.nav.home,
  about: state.nav.about
}))(Nav)
