import React from 'react'
import styles from './HelloWorld.styles.sass'

class Index extends React.Component {
  render () {
    return (<h1 className={styles.title}>Hello World ({ this.props.randomNumber })!</h1>)
  }
}

export default Index
