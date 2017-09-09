import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'

import { client } from './App'
import store from './store/clientStore'

const history = store.history
const rootEl = document.getElementById('root')

if (process.env.NODE_ENV === 'production') {
  const App = client()

  ReactDOM.render((
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  ), rootEl)
} else {
  const renderDevApp = App => ReactDOM.render((
    <Provider store={store}>
      <BrowserRouter>
        <AppContainer>
            <App />
        </AppContainer>
      </BrowserRouter>
    </Provider>
    ), rootEl
  )

  const clientApp = client()
  renderDevApp(clientApp)

  if (module.hot) {
    module.hot.accept('./App', () => {
      const { client } = require('./App')
      const nextApp = client()
      renderDevApp(nextApp)
    })
  }
}
