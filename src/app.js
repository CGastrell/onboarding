import App from 'ampersand-app'
import Navbar from 'components/navbar'
import MapView from 'view/map'
import { loadLayers, loadGeocoder } from 'mapquest-loader'

import 'bootstrap/js/modal'
import bootbox from 'bootbox'
import GlobalState from 'state'
import 'styles/main.css'

console.log('initializing app')

window.app = App
App.extend({
  globalState: new GlobalState(),
  localidades: []
})

App.Navbar = new Navbar({
  el: document.getElementById('navbar-container')
})

loadLayers()
  .then(() => {
    App.Map = new MapView({
      el: document.getElementById('map-container')
    })
  })
  // .then(() => {
  //   loadGeocoder()
  // })
  .catch(error => {
    console.log(error)
    bootbox.alert('No se pudo inicializar el mapa, por favor vuelva a cargar la pagina')
  })
