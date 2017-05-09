import App from 'ampersand-app'
import bootbox from 'components/bootbox'
export default {
  login (user, pass) {
    console.log('action:login')
    App.progress.start()

    let lastAttempt = 'login'

    return App.fetch.login(user, pass) // try login
      .then(response => {
        App.progress.inc()
        console.log('me trying to login')
        if (response.status >= 400 && response.status < 500) {
          console.log('no account for me, register then')
          lastAttempt = 'register'
          return App.fetch.register(user, pass)
        } else if (response.status >= 500) {
          console.log('api throws knives at me')
          throw new Error('weird network/api error')
        }
        return response.json()
      })
      .then(apidata => {
        App.progress.inc()
        if (lastAttempt === 'login') {
          console.log('i has pass, but stuck in burocracy')
          // login success, continue to next 'then'
          return apidata
        } else if (lastAttempt === 'register') {
          // eval register, apidata is register response object
          if (apidata.status && apidata.status >= 400) {
            console.log('api nossa like me')
            // register error, throw and forget
            throw new Error('Register user error')
          } else {
            console.log('api winks at me, so i give it another shot')
            // register success, try login again
            return App.fetch.login(user, pass)
          }
        }
      })
      .then(json => {
        App.progress.inc()
        if (lastAttempt === 'login') {
          console.log('an hour late, still stuck in burocracy')
          // json is the user object, continue to next 'then'
          return json
        } else if (lastAttempt === 'register') {
          console.log('api checks on me (even though she just winked at me)')
          // json would be login response object
          return json.json()
        }
      })
      .then(finalJson => {
        console.log('and me finally through', finalJson)
        App.user.set(finalJson)
        lastAttempt = 'login'
      })
      .catch(err => {
        App.progress.done()
        bootbox.alert({
          title: 'Error',
          message: 'Hubo un error, por favor, verifique los datos e intente nuevamente'
        })
        console.log('i died')
        console.warn(err)
      })
  },

  logout () {
    App.user.clear()
    App.init({})
  }
}
