import App from 'ampersand-app'
import L from 'leaflet'

export default {
  zoomToFeature (feature) {
    if (!feature.properties || !feature.properties.bbox) {
      return
    }

    App.Map.map.fitBounds(this.boundsFromBBoxString(feature.properties.bbox))
  },
  boundsFromBBoxString (str) {
    if (!str) {
      throw new Error('Need stringified bounds')
    }
    const llArray = str.split(',')
    if (llArray.length !== 4) {
      throw new Error('Bounds can only have 4 coordinates')
    }
    const minx = llArray[0] // west
    const miny = llArray[1] // south
    const maxx = llArray[2] // east
    const maxy = llArray[3] // north

    return new L.LatLngBounds(new L.LatLng(miny, minx), new L.LatLng(maxy, maxx))
  },
  getLayerByFeatureId (id) {
    let layerInstance = null
    App.Map.drawLayer.eachLayer(layer => {
      if (layer.feature.properties.id === id) {
        layerInstance = layer
      }
    })
    return layerInstance
  },
}
