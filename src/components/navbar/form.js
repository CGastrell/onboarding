import View from 'ampersand-view'
import L from 'leaflet'
import App from 'ampersand-app'
import $ from 'jquery'
import Actions from 'actions/localidades'

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
    window.aaa = this
    this.renderWithTemplate(this)
    const input = this.query('input')
    this.$input = $(input)
    if (App.localidades && App.localidades.length) {
      this.initializeTypeAhead()
    } else {
      Actions.fetchLocalidades()
        .then(this.initializeTypeAhead.bind(this))
    }
  },
  initializeTypeAhead: function () {
    var self = this
    this.$input.typeahead({
      source: App.localidades,
      autoSelect: false,
      displayText: function (item) {
        return (typeof item !== 'undefined' && typeof item.localidad !== 'undefined' && item.localidad) || item
      }
    })
    // the toggle is done here so it only takes effect
    // after data loading
    this.dataLoaded = true

    this.$input.change(function (event) {
      const current = self.$input.typeahead('getActive')
      if (current) {
        if (current.localidad === self.$input.val()) {
          const gjson = new L.GeoJSON(flatten(current.geometry))
          App.Map.map.setView(gjson.getBounds().getCenter(), 12)
        }
      }
    })
  }
})
