import App from 'ampersand-app'
import Navbar from 'components/navbar'
import MapView from 'view/map'
import { loadLayers, loadGeocoder } from 'mapquest-loader'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'bootstrap/js/modal'
import bootbox from 'bootbox'
import GlobalState from 'state'
import 'styles/main.css'

import cultivos from 'model/cultivo-data.json'
import tipocultivos from 'model/tipo-cultivo-data.json'

console.log('initializing app')

window.app = App
NProgress.start()

App.extend({
  state: new GlobalState(),
  locsLoaded: false,
  init: function () {
    App.Navbar = new Navbar()
    const navbarContainer = document.getElementById('navbar-container')
    navbarContainer.append(App.Navbar.el)
    NProgress.inc()
    loadLayers()
      .then(() => {
        NProgress.inc()
        this.createMapView()
        NProgress.inc()
      })
      // .then(() => {
      //   loadGeocoder()
      // })
      .catch(error => {
        console.log(error)
        bootbox.alert('No se pudo inicializar el mapa, por favor vuelva a cargar la pagina')
      })
  },
  createMapView: function () {
    // leaflet needs the element already on the dom
    // to render properly
    const mapContainer = this.cleanMapElement()

    App.Map = new MapView({
      el: mapContainer
    })
  },
  cleanMapElement: function () {
    if (App.Map && App.Map.remove) {
      App.Map.remove()
      // document.getElementById('map-container').remove()
    }
    const el = document.createElement('div')
    el.id = 'map-container'
    document.getElementById('content-container').append(el)
    return el
  }
})

App.state.cultivos.reset(cultivos)
App.state.tipoCultivos.reset(tipocultivos)

App.init()
