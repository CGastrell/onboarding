import View from 'ampersand-view'
import L from 'leaflet'
import bootbox from 'components/bootbox'
import { Model as LotModel } from 'model/lot'
import LotForm from 'components/lot-form'
import geojsonRewind from 'geojson-rewind'
import App from 'ampersand-app'
import 'leaflet-sidebar'

import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw-src.css'
import 'leaflet-sidebar/src/L.Control.Sidebar.css'
import 'styles/leaflet-custom.css'

import SidebarView from 'components/lot-list'
import {drawingStyles, controlOptions} from 'lib/leaflet-draw'

export default View.extend({
  autoRender: true,
  template: `
    <div id="map">
      <div id="rightSidebar" data-hook="rightSidebar"></div>
    </div>`,
  props: {
    inDrawMode: [ 'boolean', true, false ]
  },
  render: function () {
    this.renderWithTemplate(this)
    this.setupMap()
    // IMPORTANT: draw button customization
    const drawButton = this.query('.leaflet-draw-draw-polygon')
    drawButton.innerHTML = '<span class="glyphicon glyphicon-plus"></span> Lote' + drawButton.innerHTML
    drawButton.classList.add('green')
    // drawButton.classList.add('btn-success')
    this.sidebarView = new SidebarView({sidebarInstance: this.rightSidebar})
    this.sidebarView.render()
  },
  setupMap: function () {
    this.hybridLayer = window.MQ.hybridLayer()
    this.satelliteLayer = window.MQ.satelliteLayer()
    this.plainLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    })
    this.drawLayer = new L.GeoJSON()
    this.map = L.map(this.el, {
      layers: [this.drawLayer, this.hybridLayer],
      center: [ App.state.mapstate.center.lat, App.state.mapstate.center.lng ],
      minZoom: 2,
      maxZoom: 17,
      zoom: App.state.mapstate.zoom
    })

    this.initializeFeatures()

    L.control.layers({
      'H&iacute;brido': this.hybridLayer,
      'Sat&eacute;lite': this.satelliteLayer,
      'Plano': this.plainLayer
    }, null, {collapsed: false, position: 'topleft'}).addTo(this.map)

    let options = JSON.parse(JSON.stringify(controlOptions))
    options.edit.featureGroup = this.drawLayer
    this.drawControl = new L.Control.Draw(options).addTo(this.map)
    this.drawControl.setDrawingOptions(drawingStyles)

    this.rightSidebar = new L.Control.Sidebar('rightSidebar', {
      position: 'right'
    })
    this.map.addControl(this.rightSidebar)

    // keep the state current
    this.map.on('moveend', this.updateMapState)

    this.map.on(L.Draw.Event.CREATED, this.onCreated.bind(this))
    this.map.on(L.Draw.Event.EDITED, this.updateFeatures.bind(this))
    this.map.on(L.Draw.Event.DELETED, this.updateFeatures.bind(this))
    this.map.on(L.Draw.Event.EDITSTART, () => { App.state.editingEnabled = true })
    this.map.on(L.Draw.Event.EDITSTOP, () => { App.state.editingEnabled = false })
    // this.map.on(L.Draw.Event.DRAWVERTEX, this.vertexHandler)
    this.map.on(L.Draw.Event.DRAWSTART, this.drawStartHandler, this)
    this.map.on(L.Draw.Event.DRAWSTOP, this.drawStopHandler, this)
    this.map.on('moveend', this.onMove, this)
    this.map.on('contextmenu', this.onRightClick, this)
  },
  initializeFeatures: function () {
    if (App.state.featureCollection && App.state.featureCollection.length > 0) {
      App.state.featureCollection.toGeoJSON().features.forEach(feature => {
        App.state.settlements.add({nombre: feature.properties.settlement})
        const layer = L.geoJSON(feature)
        layer.eachLayer(l => {
          l.on('click', this.openPolygonModal, this)
          this.drawLayer.addLayer(l)
        })
      })
    }
  },
  onMove: function (event) {
    if (this.inDrawMode) {
      // surely an involuntary vertex was added, so remove it
      this.drawControl._toolbars.draw._modes.polygon.handler.deleteLastVertex()
    }
  },
  drawStartHandler: function (event) {
    this.inDrawMode = true
  },
  drawStopHandler: function (event) {
    this.inDrawMode = false
  },
  onRightClick: function (event) {
    console.log(this.inDrawMode)
    if (!this.inDrawMode) return
    console.log('kick in')
    const _markers = App.Map
      .drawControl
      ._toolbars
      .draw
      ._modes
      .polygon
      .handler
      ._markers
    if (!_markers.length || _markers.length < 4) return
    this.drawControl._toolbars.draw._modes.polygon.handler.deleteLastVertex()
    this.drawControl._toolbars.draw._modes.polygon.handler._finishShape()
  },
  // vertexHandler: function (event) {
  //   const _markers = App.Map
  //     .drawControl
  //     ._toolbars
  //     .draw
  //     ._modes
  //     .polygon
  //     .handler
  //     ._markers
  //   if (!_markers.length || _markers.length < 2) return
  //   const myIcon = L.divIcon({
  //     className: 'undo-icon',
  //     iconAnchor: [-10, -20],
  //     iconSize: [12, 12]
  //   })
  //   const lastVertex = _markers[_markers.length - 1]
  //   const lastLatLng = lastVertex._latlng
  //   const undoMarker = L.marker(lastLatLng, {icon: myIcon}).addTo(App.Map.markers)
  //   undoMarker.on('click', function onMarkerClick (event) {
  //     event.preventDefault()
  //     event.stopPropagation()
  //     App.Map.drawControl._toolbars.draw._modes.polygon.handler.deleteLastVertex()
  //     undoMarker.off('click', onMarkerClick)
  //     undoMarker.remove()
  //   })
  // },
  onCreated: function (event) {
    // event.target -> L.Map
    // event.layer -> L.Polygon (or proper geometry primitive)
    const layer = event.layer

    layer.feature = layer.feature || new LotModel().toJSON()
    layer.feature.properties.area = this.getPolygonArea(layer)
    layer.feature.properties.bbox = layer.getBounds().toBBoxString()
    layer.feature.properties.perimeter = this.getPolygonPerimeter(layer)

    this.drawLayer.addLayer(layer)

    // _leaflet_id only exists once the layer is on the map
    layer.feature.properties.id = layer._leaflet_id

    let newLayer = this.updateFeatures({
      type: L.Draw.Event.CREATED,
      layer: layer
    })

    // when features update, layer reference is lost
    // if we want to open the modal, we'll have to figure out
    // some way of tracking the layer
    this.openPolygonModal({target: newLayer})
  },
  reAddLayer: function (layer) {
    layer.addTo(this.drawLayer)
    layer.feature.properties.id = layer._leaflet_id
    layer.feature.properties.area = this.getPolygonArea(layer)
    layer.feature.properties.bbox = layer.getBounds().toBBoxString()
    layer.feature.properties.perimeter = this.getPolygonPerimeter(layer)

    layer.on('click', this.openPolygonModal, this)

    // layer.bindPopup(`
    //   <span>${layer.feature.properties.settlement}</span><br />
    //   <strong>${layer.feature.properties.nombre}</strong>
    // `)
    // layer.on('mouseover', function (e) {
    //   this.openPopup()
    // })
    // layer.on('mouseout', function (e) {
    //   this.closePopup()
    // })

    if (!layer.feature || !layer.getCenter) return
    const southest = layer.getBounds().getSouth()

    const label = new L.Marker([southest, layer.getCenter().lng], {
      icon: new L.DivIcon({
        className: 'icon-label',
        iconSize: [120, 45],
        iconAnchor: [60, 0],
        html: `
          ${layer.feature.properties.settlement}<br />
          <strong>${layer.feature.properties.nombre}</strong>
        `
      })
    })
    label.addTo(this.drawLayer)
  },
  updateMapState: function (event) {
    App.state.mapstate = {
      center: Object.assign({}, event.target.getCenter()),
      zoom: event.target.getZoom()
    }
  },
  updateFeatures: function (event) {
    let layerTempId = 0
    let returnLayer = null
    if (event.type === L.Draw.Event.CREATED) {
      layerTempId = event.layer.feature.properties.id
    }
    this.drawLayer.eachLayer(layer => {
      if (!layer.feature || !layer.feature.geometry) return
      if (layer.feature.geometry.type !== 'Polygon') return
      layer.feature.properties.area = this.getPolygonArea(layer)
      layer.feature.properties.bbox = layer.getBounds().toBBoxString()
      layer.feature.properties.perimeter = this.getPolygonPerimeter(layer)
    })

    const featureCollection = this.drawLayer.toGeoJSON()
    featureCollection.features = featureCollection.features.filter(feature => {
      return feature.geometry.type === 'Polygon'
    })
    // App.state.featureCollection.reset()
    if (event.type === L.Draw.Event.DELETED && !featureCollection.features.length) {
      App.stateAnyway = true
    }

    App.state.featureCollection.reset(geojsonRewind(featureCollection).features, {parse: true})

    this.drawLayer.clearLayers()

    const reAdd = layer => {
      if (event.type === L.Draw.Event.CREATED && layer.feature.properties.id === layerTempId) {
        returnLayer = layer
      }
      this.reAddLayer(layer)
    }
    // temp layer to rebuild the drawLayer
    L.geoJSON(App.state.featureCollection.toGeoJSON())
      .eachLayer(reAdd)

    return returnLayer
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
  openPolygonModal: function (event) {
    if (App.state.editingEnabled) {
      return
    }

    App.state.modalIsOpen = true
    const layer = event.target
    const feature = layer.toGeoJSON()

    this.lotForm = new LotForm({
      datamodel: feature.properties,
      layer: layer
    })
    this.lotForm.render()

    bootbox.form(
      {
        message: this.lotForm.el,
        title: 'Datos del lote'
      },
      save => {
        if (!save) { // canceled
          App.state.modalIsOpen = false
          return
        }
        this.lotForm.formView.fields.forEach(fieldView => {
          if ('validate' in fieldView) fieldView.validate()
        })
        if (!this.lotForm.formView.valid) {
          bootbox.alert({
            title: 'Validación de datos',
            message: 'Por favor, revise que todos los campos estén correctos'
          })
          return false
        }
        App.state.modalIsOpen = false
        layer.feature.properties = Object.assign({}, feature.properties, this.lotForm.formView.data)
        this.updateFeatures({type: null})
      }
    )
  }
})
