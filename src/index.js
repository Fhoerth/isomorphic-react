import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import { AppContainer } from 'react-hot-loader'

import BrowserApp from './app/BrowserApp'

const rootEl = document.getElementById('root')

if (process.env.NODE_ENV === 'production') {
  ReactDOM.hydrate((
  <BrowserApp />
  ), rootEl)
} else {
  const renderDevApp = App => ReactDOM.hydrate((
    <AppContainer>
      <App />
    </AppContainer>
  ), rootEl)

  renderDevApp(BrowserApp)

  if (module.hot) {
    module.hot.accept('./app/BrowserApp', () => renderDevApp(require('./app/BrowserApp').default))
  }
}
