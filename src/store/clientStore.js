import createHistory from 'history/createBrowserHistory'

import configureStore from './configureStore'

const initialState = (window.__INITIAL_DATA__ && window.__INITIAL_DATA__.state) || {}
const store = configureStore(initialState)
const history = createHistory()
store.history = history

export default store
