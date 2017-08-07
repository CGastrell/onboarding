import App from 'ampersand-app'
import fetch from 'lib/fetch'
import bootbox from 'components/bootbox'

export default {
  fetchUserData () {
    App.progress.inc()
    return fetch.get('/onboarding/data')
      .then(res => {
        App.progress.inc()
        if (res.status === 204) {
          return null
        } else {
          return res.json()
        }
      })
      .then(data => {
        if (!data) {
          console.log('no user data, carry on')
          App.progress.done()
        } else {
          this.handleUserData(data)
        }
      })
      .catch(e => {
        console.warn(e)
        App.progress.done()
      })
  },
  handleUserData (data) {
    bootbox.confirm({
      size: 'small',
      title: 'Restaurar datos',
      message: 'Desea cargar los datos de su último pedido?',
      callback: restaurar => {
        App.progress.done()
        if (restaurar) {
          console.log('user wants his data back')
          App.init(data.data)
        }
      }
    })
  },
  saveUserData (save) {
    if (save) {
      fetch.post('/onboarding/data', {
        body: JSON.stringify({data: App.state.toJSON()})
      })
      .then(res => {
        if (res.status >= 400) {
          throw new Error('API error')
        }
        return res.json()
      })
      .then(function () {
        bootbox.alert({
          title: 'Enhorabuena!',
          message: 'Se ha enviado su solicitud de presupuesto.<br /><br />A la brevedad nos contactaremos con Ud.'
        })
      })
      .catch(error => {
        console.warn(error)
        bootbox.alert({
          title: 'Error',
          message: 'Hubo un error guardando los datos. Por favor, inténtelo nuevamente'
        })
      })
    }
  },
  requestBudget (payload) {
    const returnToNormal = () => {
      App.progress.done()
      App.Map.rightSidebar.show()
    }

    fetch.post(
      '/onboarding/anonymous/data',
      { body: JSON.stringify({data: payload}) },
      true
    )
    .then(res => {
      if (res.status >= 400) {
        throw new Error('API error')
      }
      return res.json()
    })
    .then(function () {
      bootbox.alert({
        title: 'Enhorabuena!',
        message: 'Se ha enviado su solicitud de presupuesto.<br /><br />A la brevedad nos contactaremos con Ud.',
        callback: returnToNormal
      })
    })
    .catch(error => {
      console.warn(error)
      bootbox.alert({
        title: 'Error',
        message: 'Hubo un error guardando los datos. Por favor, inténtelo nuevamente',
        callback: returnToNormal
      })
    })
  }
}
