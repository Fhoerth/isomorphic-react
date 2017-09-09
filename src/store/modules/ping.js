import APIClient from '../../lib/APIClient'

const FETCH_PING = 'FETCH_PING_REQUEST'
const FETCH_PING_SUCCESS = 'FETCH_PING_SUCCESS'
const FETCH_PING_FAILURE = 'FETCH_PING_FAILURE'

const sleep = (m) => new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, m)
})

export const actionTypes = {
  FETCH_PING,
  FETCH_PING_SUCCESS
}

const fetchPingSuccess = response => ({
  type: FETCH_PING_SUCCESS,
  response
})

const fetchPingFailure = error => ({
  type: FETCH_PING_FAILURE,
  error
})

const fetchPing = () => (dispatch, getState) => {
  dispatch({
    type: FETCH_PING
  })

  return sleep(500).then(() => APIClient.fetchPing().then(response => {
    dispatch(fetchPingSuccess(response))
  }).catch(error => {
    dispatch(fetchPingFailure(error))
  }))
}

export const actionCreators = {
  fetchPing,
  fetchPingSuccess
}

export const defaultState = {
  fetchingPing: false,
  fetchPingRequested: false,
  fetchPingSuccess: false,
  fetchPingResponse: null
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_PING: {
      return { ...state, fetchingPing: true }
    }

    case FETCH_PING_SUCCESS: {
      return {
        ...state,
        fetchingPing: false,
        fetchPingRequested: true,
        fetchPingSuccess: true,
        fetchPingResponse: action.response
      }
    }

    default:
      return state
  }
}
