import { routerReducer, routerMiddleware } from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import rootReducer from './rootReducer'

export const initialState = { }

export default (preloadedState = initialState) => {
  const store = createStore(combineReducers({ ...rootReducer, router: routerReducer }), preloadedState, applyMiddleware(thunk))
  store.history = typeof window !== 'undefined' ? createHistory() : null
  return store
}
