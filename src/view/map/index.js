import View from 'ampersand-view'
import L from 'leaflet'

import 'leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw-src.css'

const drawDefaultOptions = {
  position: 'topright',
  edit: {
    featureGroup: null,
    poly: {
      allowIntersection: false
    }
  },
  draw: {
    marker: false,
    polyline: false,
    rectangle: false,
    circle: false,
    polygon: {
      allowIntersection: false,
      showArea: true
    }
  }
}

const lotModel = {
  id: null,
  nombre: '',
  settlementId: null
}

export default View.extend({
  autoRender: true,
  template: `<div id="map" style="flex-grow: 1;"></div>`,
  render: function () {
    window.aaa = this
    this.renderWithTemplate(this)
    this.setupMap()
  },
  setupMap: function () {
    this.hybridLayer = window.MQ.hybridLayer()
    this.satelliteLayer = window.MQ.satelliteLayer()
    this.plainLayer = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })
    this.drawLayer = new L.GeoJSON()
    this.map = L.map(this.el, {
      layers: [this.drawLayer, this.hybridLayer],
      center: [ -38.68550976001201, -63.89648437500001 ],
      zoom: 5
    })

    L.control.layers({
      'H&iacute;brido': this.hybridLayer,
      'Sat&eacute;lite': this.satelliteLayer,
      'Plano': this.plainLayer
    }, null, {position: 'topleft'}).addTo(this.map)

    let options = JSON.parse(JSON.stringify(drawDefaultOptions))
    options.edit.featureGroup = this.drawLayer
    this.drawControl = new L.Control.Draw(options).addTo(this.map)

    this.map.on(L.Draw.Event.CREATED, (event) => {
      // event.target -> L.Map
      // event.layer -> L.Polygon (or proper geometry primitive)
      const layer = event.layer
      layer.feature = layer.feature || {}
      layer.feature.type = 'Feature' // <- this is IMPORTANT
      layer.feature.properties = layer.feature.properties || JSON.parse(JSON.stringify(lotModel))
      layer.on('click', this.openPolygonModal)

      this.drawLayer.addLayer(layer)

      // _leaflet_id only exists once the layer is on the map
      layer.feature.properties.id = layer._leaflet_id
    })
  },
  update: function () {

  },
  // this is now performed by L.GeoJSON.toGeoJSON()
  layerToGeoJSON: function (layer) {
    const features = []
    layer.eachLayer(collect)
    function collect (l) { if ('toGeoJSON' in l) features.push(l.toGeoJSON()) }
    return {
      type: 'FeatureCollection',
      features: features
    }
  },
  openPolygonModal: function (event) {
    console.log(event.target.toGeoJSON())
    // bootbox.alert('Flash!')
  }
})
