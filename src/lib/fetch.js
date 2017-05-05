const fetchOptions = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  mode: 'cors'
}

const apiBaseUrl = 'http://localhost:3001'

function toBase64 (string) {
  return new Buffer(string || '').toString('base64')
}

export default {
  post: function (url, options = {}) {
    const postOptions = Object.assign(
      {},
      options,
      fetchOptions,
      { method: 'post' }
    )
    console.log(postOptions)
    return window.fetch(`${apiBaseUrl}${url}`, postOptions)
  },
  login: function (user, pass) {
    const localOptions = Object.assign({}, fetchOptions, { method: 'post' })
    localOptions.headers.Authorization = 'Basic ' + toBase64(user + ':' + pass)
    return window.fetch(`${apiBaseUrl}/token`, localOptions)
  },
  register: function (data) {
    const endpoint = `${apiBaseUrl}/onboarding/register`
    return window.fetch(endpoint)
  }
}
