const layerLoader = () => new Promise((resolve, reject) => {
  const scriptTag = document.createElement('script')
  scriptTag.setAttribute('type', 'text/javascript')
  scriptTag.setAttribute('src', 'https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-map.js?key=tBf7drPHWhSkCZf0nbfI6hwv1NuLnd1V')
  document.body.appendChild(scriptTag)
  scriptTag.onerror = function () {
    reject(new Error('Could not load MQ Leaflet tile library'))
  }
  scriptTag.addEventListener('load', function (event) {
    resolve(event)
  })
})

const geocoderLoader = () => new Promise((resolve, reject) => {
  const scriptTag = document.createElement('script')
  scriptTag.setAttribute('type', 'text/javascript')
  scriptTag.setAttribute('src', 'https://www.mapquestapi.com/sdk/leaflet/v2.2/mq-geocoding.js?key=tBf7drPHWhSkCZf0nbfI6hwv1NuLnd1V')
  document.body.appendChild(scriptTag)
  scriptTag.onerror = function () {
    reject(new Error('Could not load MQ Leaflet geocoding library'))
  }
  scriptTag.addEventListener('load', function (event) {
    resolve(event)
  })
})

export {geocoderLoader as loadGeocoder}
export {layerLoader as loadLayers}
