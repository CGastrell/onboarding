// this kind of "extend" doesn't work on leaflet
// not used, but kept here for the inverse of toBBoxString
import L from 'leaflet'

L.latLngBounds.prototype.fromBBoxString = function (str) {
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
}

export default L
