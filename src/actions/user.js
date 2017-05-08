// import App from 'ampersand-app'
import fetch from 'lib/fetch'
import bootbox from 'components/bootbox'

export default {
  fetchUserData () {
    return fetch.get('/onboarding/data')
      .then(res => {
        // turn empty (no content) responses into {}
        if (res.status === 204) {
          return null
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (!data) {
          console.log('no user data, carry on')
        } else {
          console.log(data)
          this.handleUserData(data)
        }
      })
      .catch(e => {
        console.warn(e)
      })
  },
  handleUserData (data) {
    bootbox.confirm({
      size: 'small',
      title: 'Restaurar datos',
      message: 'Desea cargar los datos de su último pedido?',
      callback: restaurar => {
        console.log('user wants his data back')
      }
    })
  }
}
