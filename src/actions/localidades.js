import App from 'ampersand-app'

export default {
  fetchLocalidades () {
    return window.fetch('localidades.json')
      .then(r => r.json())
      .then(data => {
        // fancy loading line
        if (App.mostlyLoaded) {
          App.progress.done()
        } else {
          App.mostlyLoaded = true
          App.progress.inc()
        }

        App.localidades = data
        return data
      })
      .catch(e => {})
  }
}
