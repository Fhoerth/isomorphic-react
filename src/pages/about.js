import React from 'react'

class About extends React.Component {
  static loadInitialProps ({ req, store }) {
    return Promise.resolve({
      title: 'About Page',
      isServer: !!req
    })
  }

  render () {
    return (
      <h1>{this.props.title} (rendered { this.props.isServer ? ' from server' : 'from client' })</h1>
    )
  }
}

export default About
