import { routerReducer, routerMiddleware } from 'react-router-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'

import rootReducer from './rootReducer'

const isProduction = process.env.NODE_ENV === 'production'

function getReducers (rootReducer) {
  return { ...rootReducer, router: routerReducer }
}

export const initialState = {}

export default (preloadedState = initialState) => {
  const store = createStore(combineReducers(getReducers(rootReducer)), preloadedState, applyMiddleware(thunk))

  // Redux HMR
  if (!isProduction && module.hot) {
    module.hot.accept('./rootReducer', () => store.replaceReducer(
      combineReducers(
        getReducers(require('./rootReducer').default))
      )
    )
  }

  return Object.assign(store, {
    history: typeof window !== 'undefined' ? createHistory() : null
  })
}
