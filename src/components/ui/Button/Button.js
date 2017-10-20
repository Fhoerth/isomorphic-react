import React from 'react'

class Button extends React.Component {
  handleClick () {
    alert('This is an alert fired by a handleClick')
  }

  render () {
    return (
      <button onClick={this.handleClick.bind(this)}>Hello world!</button>
    )
  }
}

export default Button
