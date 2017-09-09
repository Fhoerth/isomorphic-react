import Promise from 'bluebird'
import React from 'react'

import { connect  } from 'react-redux'
import { actionCreators } from '../store/modules/ping'
import { actionCreators as indexActionCreators } from '../store/modules/index'


class Index extends React.Component {
  static loadInitialProps ({ req, store }) {
    return Promise.resolve({
      title: 'Index Page',
      isServer: !!req
    })
  }

  static loadInitialData ({ store }) {
    return Promise.all([
      store.dispatch(actionCreators.fetchPing()),
      store.dispatch(indexActionCreators.fetchDescription())
    ])
  }

  render () {
    return (
      <container>
        <h1>{this.props.title} (rendered { this.props.isServer ? ' from server' : 'from client' })</h1>
        { this.props.loadingInitialData ? (
          <div>Loading Initial Data...</div>
        ) : (
          <div>
            <h3>{ this.props.fetchingPing ? (<span>Loading...</span>) : (<span>{JSON.stringify(this.props.ping)}</span>) }</h3>
            <h5>{ this.props.fetchingDescription ? (<span>Loading...</span>) : (<span>{this.props.description}</span>) }</h5>
          </div>
        )}
      </container>
    )
  }
}

export default connect(state => ({
  ping: state.ping.fetchPingResponse,
  fetchingPing: state.ping.fetchingPing,
  description: state.index.fetchDescriptionResponse,
  fetchingDescription: state.index.fetchingDescription
}))(Index)
