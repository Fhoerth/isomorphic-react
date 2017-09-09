import APIClient from '../../lib/APIClient'

const FETCH_DESCRIPTION = 'FETCH_DESCRIPTION_REQUEST'
const FETCH_DESCRIPTION_SUCCESS = 'FETCH_DESCRIPTION_SUCCESS'
const FETCH_DESCRIPTION_FAILURE = 'FETCH_DESCRIPTION_FAILURE'

const sleep = (m) => new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, m)
})

export const actionTypes = {
  FETCH_DESCRIPTION,
  FETCH_DESCRIPTION_SUCCESS
}

const fetchDescriptionSuccess = response => ({
  type: FETCH_DESCRIPTION_SUCCESS,
  response
})

const fetchDescriptionFailure = error => ({
  type: FETCH_DESCRIPTION,
  error
})

const fetchDescription = () => (dispatch, getState) => {
  dispatch({
    type: FETCH_DESCRIPTION
  })

  return sleep(500).then(() => APIClient.fetchIndexDescription().then(response => {
    dispatch(fetchDescriptionSuccess(response.data))
  }).catch(error => {
    dispatch(fetchDescriptionFailure(error))
  }))
}

export const actionCreators = {
  fetchDescription,
  fetchDescriptionSuccess,
  fetchDescriptionFailure
}

export const defaultState = {
  fetchingDescription: false,
  fetchDescriptionRequested: false,
  fetchDescriptionSuccess: false,
  fetchDescriptionResponse: null
}

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_DESCRIPTION: {
      return { ...state, fetchingDescription: true }
    }

    case FETCH_DESCRIPTION_SUCCESS: {
      return {
        ...state,
        fetchingDescription: false,
        fetchDescriptionRequested: true,
        fetchDescriptionSuccess: true,
        fetchDescriptionResponse: action.response
      }
    }

    default:
      return state
  }
}
