import Promise from 'bluebird'
import React from 'react'

import { connect  } from 'react-redux'
import { actionCreators } from '../store/modules/ping'
import { actionCreators as indexActionCreators } from '../store/modules/index'

import Button from '../components/ui/Button'

class Index extends React.Component {
  static loadInitialProps ({ req, store }) {
    return Promise.all([
      store.dispatch(actionCreators.fetchPing()),
      store.dispatch(indexActionCreators.fetchDescription())
    ]).then(() => {
      return {
        title: 'Index Page',
        isServer: !!req
      }
    })
  }

  render () {
    return (
      <container>
        <Button />
        <h1>{this.props.title} (rendered { this.props.isServer ? ' from server!!' : 'from client :D :D!' })</h1>
        { this.props.loadingInitialData ? (
          <div>Loading Initial Data...</div>
        ) : (
          <div>
            <h3>Ping: {JSON.stringify(this.props.ping)}</h3>
            <h5>Description!!!!: {this.props.description}</h5>
          </div>
        )}
      </container>
    )
  }
}

export default connect(state => ({
  ping: state.ping.fetchPingResponse,
  description: state.index.fetchDescriptionResponse
}))(Index)
