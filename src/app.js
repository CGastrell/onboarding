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

console.log('initializing app')

window.app = App

App.extend({
  state: new GlobalState(),
  progress: NProgress,
  Navbar: null,
  Map: null,
  mostlyLoaded: false,
  config: {},
  init: function () {
    App.progress.start()
    App.Navbar = this.createNavbarView()
    const prevState = window.localStorage.getItem('globalState')
    if (prevState) {
      bootbox.confirm({
        title: 'Restaurar sesion?',
        message: 'Desea restaurar los datos de la ultima sesion?',
        callback: (yes) => {
          if (yes) {
            const stateObject = JSON.parse(prevState)
            const locs = App.state.localidades
            App.state = new GlobalState(stateObject)
            App.state.localidades = locs
          }
          this.initMapPage()
        }
      })
    } else {
      window.localStorage.clear()
      this.initMapPage()
    }
  },
  bindState: function () {
    console.log('bind them')
    App.state.on('change', () => {
      window.localStorage.setItem('globalState', JSON.stringify(App.state.toJSON()))
    })
  },
  initMapPage: function () {
    loadLayers()
    .then(() => {
      App.progress.inc()
      App.Map = this.createMapView()
      if (App.mostlyLoaded) {
        App.progress.done()
      } else {
        App.mostlyLoaded = true
        App.progress.inc()
      }
      this.bindState()
    })
    // .then(() => {
    //   loadGeocoder()
    // })
    .catch(error => {
      console.warn(error)
      bootbox.alert('No se pudo inicializar el mapa, por favor vuelva a cargar la pagina')
    })
  },
  createNavbarView: function () {
    if (App.Navbar) {
      App.Navbar.remove()
    }
    const nav = new Navbar()
    const navbarContainer = document.getElementById('navbar-container')
    navbarContainer.appendChild(nav.el)
    return nav
  },
  createMapView: function () {
    // leaflet needs the element already on the dom
    // to render properly
    const mapContainer = this.cleanMapElement()

    return new MapView({
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
    document.getElementById('content-container').appendChild(el)
    return el
  }
})

App.init()
