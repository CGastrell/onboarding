import App from 'ampersand-app'
import Navbar from 'components/navbar'
import MapView from 'view/map'
import { loadLayers, loadGeocoder } from 'lib/mapquest-loader'
import fetch from 'lib/fetch'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import 'bootstrap/js/modal'
import bootbox from 'bootbox'
import GlobalState from 'state'
import User from 'model/user'
import 'styles/main.css'

// import * as Actions from 'actions'
// import { Auth } from 'actions'
// import AuthActions from 'actions/auth'

window.app = App

App.extend({
  state: new GlobalState(),
  progress: NProgress,
  Navbar: null,
  stateAnyway: false, // just a flag from leafletDraw event
  Map: null,
  mostlyLoaded: false,
  config: {},
  user: new User(),
  fetch: fetch,
  init: function (state) { // reinicializar aca, cleanup por cada view, preservar locs
    if (!App.progress.status) {
      App.progress.start()
    } else {
      App.progress.inc()
    }

    let prevState = null

    if (state) {
      // if state is provided, set it as .state
      // and continue initialization
      const locs = state.localidades
      if (state.isState) {
        state = state.toJSON()
      }
      state.localidades = locs
      App.state = new GlobalState(state)
    } else {
      prevState = this.getLastState()
    }

    App.progress.inc()

    if (prevState) {
      bootbox.confirm({
        title: 'Restaurar sesion?',
        message: 'Desea restaurar los datos de la ultima sesion?',
        callback: (yes) => {
          if (yes) {
            App.init(prevState)
          } else {
            window.localStorage.clear()
            this.bindState()
            this.initializeViews()
          }
        }
      })
    } else {
      this.bindState()
      this.initializeViews()
    }
  },
  initializeViews: function () {
    App.Navbar = this.initNavbar()
    App.Map = this.initMapPage()
  },
  getLastState: function () {
    const state = window.localStorage.getItem('globalState')
    if (!state) return false
    let stateObject = false
    try {
      stateObject = JSON.parse(state)
    } catch (ex) {
      console.warn(ex)
    }
    // delete lastState if no features
    if (
      !stateObject.featureCollection ||
      !stateObject.featureCollection.features ||
      !stateObject.featureCollection.features.length
    ) {
      window.localStorage.clear()
      return false
    }
    return stateObject
  },
  bindState: function () {
    App.state.on('change', (state, data) => {
      console.log('state change')
      if (!App.stateAnyway && !App.state.featureCollection) return
      if (!App.stateAnyway && !App.state.featureCollection.features) return
      if (!App.stateAnyway && !App.state.featureCollection.features.length) return

      // if user has deleted all features, reset localStorage
      if (App.state.featureCollection.features.length === 0) {
        window.localStorage.clear()
      } else {
        window.localStorage.setItem('globalState', JSON.stringify(App.state.toJSON()))
      }
      App.stateAnyway = false
    })
  },
  initMapPage: function () {
    if (App.Map) {
      App.Map.remove()
    }
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
      // this.bindState()
    })
    // .then(() => {
    //   loadGeocoder()
    // })
    .catch(error => {
      console.warn(error)
      bootbox.alert('No se pudo inicializar el mapa, por favor vuelva a cargar la página')
    })
  },
  initNavbar: function () {
    if (App.Navbar) {
      App.Navbar.remove()
    }
    return this.createNavbarView()
  },
  createNavbarView: function () {
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
    }
    const el = document.createElement('div')
    el.id = 'map-container'
    document.getElementById('content-container').appendChild(el)
    return el
  }
})

App.init()
