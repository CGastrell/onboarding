import View from 'ampersand-view'
import L from 'leaflet'
import bootbox from 'components/bootbox'
import { Model as Lot } from 'model/lot'
import LotForm from 'components/lot-form'
import geojsonRewind from 'geojson-rewind'
import App from 'ampersand-app'

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

export default View.extend({
  autoRender: true,
  template: `<div id="map"></div>`,
  initialize: function () {
    this.onCreated = this.onCreated.bind(this)
  },
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
      center: [ App.state.mapstate.center.lat, App.state.mapstate.center.lng ],
      zoom: App.state.mapstate.zoom
    })

    // keep the state current
    this.map.on('moveend', this.updateState)

    L.control.layers({
      'H&iacute;brido': this.hybridLayer,
      'Sat&eacute;lite': this.satelliteLayer,
      'Plano': this.plainLayer
    }, null, {position: 'topleft'}).addTo(this.map)

    let options = JSON.parse(JSON.stringify(drawDefaultOptions))
    options.edit.featureGroup = this.drawLayer
    this.drawControl = new L.Control.Draw(options).addTo(this.map)

    this.map.on(L.Draw.Event.CREATED, this.onCreated)
  },
  onCreated: function (event) {
    // event.target -> L.Map
    // event.layer -> L.Polygon (or proper geometry primitive)
    const layer = event.layer
    layer.feature = layer.feature || {}
    layer.feature.type = 'Feature' // <- this is IMPORTANT
    layer.feature.properties = layer.feature.properties || new Lot().toJSON()
    // rewind layer points to avoid problems later
    layer.setLatLngs(this.rewind(layer))
    layer.feature.properties.area = this.getPolygonArea(layer)
    layer.feature.properties.perimeter = this.getPolygonPerimeter(layer)
    layer.on('click', this.openPolygonModal, this)

    this.drawLayer.addLayer(layer)

    // _leaflet_id only exists once the layer is on the map
    layer.feature.properties.id = layer._leaflet_id
    this.openPolygonModal({target: layer})
  },
  updateState: function (event) {
    App.state.mapstate.center = Object.assign({}, event.target.getCenter())
    App.state.mapstate.zoom = event.target.getZoom()
  },
  rewind: function (layer) {
    let gj = layer.toGeoJSON()
    gj = geojsonRewind(gj)
    return L.geoJSON(gj).getLayers()[0].getLatLngs()
  },
  // returns the area in m2
  // TODO: oddity, the function is supposed to work with getLatLngs(),
  // which is a nested array, but that is returning 0 somehow. So reduce.
  getPolygonArea: function (layer) {
    return L.GeometryUtil.geodesicArea(layer.getLatLngs().reduce((acc, cur) => Array.prototype.concat(acc, cur)))
  },
  getPolygonPerimeter: function (layer) {
    const points = layer.getLatLngs().reduce((acc, cur) => Array.prototype.concat(acc, cur))
    if (points.length < 3) {
      throw new Error('this is not a polygon')
    }
    let totalDistance = 0
    for (var ii = 0; ii < points.length - 1; ii++) {
      totalDistance += L.latLng(points[ii]).distanceTo(L.latLng(points[ii + 1]))
    }
    return totalDistance
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
    const feature = event.target.toGeoJSON()
console.log(feature)
    this.lotForm = new LotForm({
      model: new Lot({
        id: feature.properties.id,
        geometry: feature.geometry,
        area: feature.properties.area,
        perimeter: feature.properties.perimeter
      })
    })
    this.lotForm.render()

    const theModal = bootbox.form(
      {
        message: this.lotForm.el,
        title: 'Datos del lote'
      },
      save => {
        console.log('save callback:')
        console.log(save)
        if (!save) return

        if (!this.lotForm.formView.valid) {
          bootbox.alert({
            title: 'Validacion de datos',
            message: 'Por favor, revise que todos los campos esten correctos'
          })
          return false
        }
        this.lotForm.remove()
      }
    )
  }
})
