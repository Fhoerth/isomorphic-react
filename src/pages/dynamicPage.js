import React from 'react'

class DynamicPage extends React.Component {
  static loadInitialProps ({ req, store }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: 'Dynamic Page',
          isServer: !!req
        })
      }, 0)
    })
  }

  render () {
    return (
      <h1>{this.props.title} (rendered { this.props.isServer ? ' from server!!xD' : 'from client!!!! xD' })</h1>
    )
  }
}

export default DynamicPage
