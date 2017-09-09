import axios from 'axios'

export const fallbackErrorMessage = 'There was an error while trying to fetch data'

export function APIError (error) {
  this.name = 'APIError'
  this.message = error.message || fallbackErrorMessage
}

export class APIClient {
  constructor (baseURL = '/') {
    this.client = axios.create({
      baseURL: 'http://localhost:9000/'
    })
  }

  handleError (error) {
    throw new APIError(error)
  }

  fetchPing () {
    return this.client.get('/ping')
      .then(result => result.data)
      .catch(this.handleError.bind(this))
  }

  fetchIndexDescription () {
    return this.client.get('/index-description')
      .then(result => result.data)
      .catch(this.handleError.bind(this))
  }
}

const instance = new APIClient()
export default instance
