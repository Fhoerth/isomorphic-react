import React from 'react'
import PropTypes from 'prop-types'

export default class DynamicRoutesProvider extends React.Component {
  static childContextTypes = {
    importedModules: PropTypes.array,
    addImportedModule: PropTypes.func
  }

  constructor (props, context) {
    super(props, context)

    this.importedModules = props.importedModules
  }

  getChildContext () {
    return {
      addImportedModule: module => {
        this.importedModules.push(module)
      },
      importedModules: this.importedModules
    }
  }

  render () {
    return React.Children.only(this.props.children)
  }
}
