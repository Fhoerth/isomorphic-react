import React from 'react'

class About extends React.Component {
  static loadInitialProps ({ req, store }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: 'About Page',
          isServer: !!req
        })
      }, 500)
    })
  }

  render () {
    return (
      <h1>{this.props.title} (rendered { this.props.isServer ? ' from server' : 'from client' })</h1>
    )
  }
}

export default About
