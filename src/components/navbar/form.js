import View from 'ampersand-view'
import L from 'leaflet'
import App from 'ampersand-app'
import $ from 'jquery'

import NProgress from 'nprogress'

import flatten from 'geojson-flatten'
import 'bootstrap-3-typeahead'

const template = `
<form class="navbar-form navbar-left" role="search">
  <input type="text" class="form-control" placeholder="Search">
</form>
`

export default View.extend({
  // autoRender: true, // a subview with autoRender won't work
  props: {
    dataLoaded: ['boolean', false, false]
  },
  template: template,
  bindings: {
    dataLoaded: {
      type: 'toggle'
    }
  },
  render: function () {
    this.renderWithTemplate(this)
    const input = this.query('input')
    const $input = $(input)
    window.fetch('localidades.json')
      .then(response => response.json())
      .then(json => {
        App.state.localidades = json
        this.dataLoaded = true
        App.progress.inc()
        $input.typeahead({
          source: App.state.localidades,
          autoSelect: false,
          displayText: function (item) {
            return (typeof item !== 'undefined' && typeof item.localidad !== 'undefined' && item.localidad) || item
          }
        })
        if (App.mostlyLoaded) {
          App.progress.done()
        } else {
          App.mostlyLoaded = true
          App.progress.inc()
        }

        $input.change(function (event) {
          const current = $input.typeahead('getActive')
          if (current) {
            if (current.localidad === $input.val()) {
              const gjson = new L.GeoJSON(flatten(current.geometry))
              App.Map.map.setView(gjson.getBounds().getCenter(), 12)
            }
          }
        })
      })
      .catch(error => {
        console.warn(error)
      })
  }
})
