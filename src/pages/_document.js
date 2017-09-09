import React from 'react'
import { renderRoutes } from 'react-router-config'

import Nav from '../components/Nav'
import RouterLoader from '../components/RouterLoader'
import styles from '../styles/_document.styles.sass'

class Document extends React.Component {
  render () {
    return (
      <main>
        <Nav size={15} />
        <header className={styles.header}>
          Header Component
        </header>
        <main className={styles.main}>
          {renderRoutes(this.props.route.routes, this.props)}
        </main>
        <footer className={styles.footer}>
          Footer Component
        </footer>
      </main>
    )
  }
}

export default Document
