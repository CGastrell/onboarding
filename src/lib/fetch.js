import App from 'ampersand-app'
import merge from 'lodash/merge'
import config from 'config'

const fetchOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  mode: 'cors'
}

const apiBaseUrl = config.apiUrl

function toBase64 (string) {
  return new Buffer(string || '').toString('base64')
}

export default {
  _fetch: function (url, options) {
    const reqOptions = merge(
      {},
      options,
      fetchOptions // defaults no-override
    )
    return window.fetch(`${apiBaseUrl}${url}`, reqOptions)
  },
  _bearerHeader: function () {
    return {
      'Authorization': `Bearer ${App.user.token}`
    }
  },
  get: function (url, options = {}) {
    const getOptions = merge(
      {},
      options,
      {
        method: 'get',
        headers: this._bearerHeader()
      }
    )
    return this._fetch(url, getOptions)
  },
  post: function (url, options = {}, basic = false) {
    const postOptions = merge(
      {},
      options,
      {
        method: 'post',
        headers: basic ? {} : this._bearerHeader()
      }
    )
    return this._fetch(url, postOptions)
  },
  login: function (user, pass) {
    const localOptions = {
      headers: {
        Authorization: 'Basic ' + toBase64(user + ':' + pass)
      }
    }
    return this.post('/token', localOptions, true)
  },
  register: function (user, pass) {
    const localOptions = {body: JSON.stringify({email: user, password: pass})}
    return this.post('/onboarding/register', localOptions, true)
  }
}
