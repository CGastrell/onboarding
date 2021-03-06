// import AmpersandCollection from 'ampersand-collection'
// import AmpersandModel from 'ampersand-model'
import { Collection as Cultivos } from 'model/cultivo'

const defaultProps = () => {
  return {
    id: 0,
    nombre: '',
    settlement: '',
    // id_tipo_cultivo: 0,
    // id_localidad: 0,
    cultivos: new Cultivos(),
    mol: true,
    axa: true,
    cosecha: true,
    mascara: true,
    // geo stuff
    area: 0,
    perimeter: 0,
    bbox: []
  }
}
// export const Model = AmpersandModel.extend({
//   idAttribute: 'id',
//   props: {
//     id: 'number',
//     nombre: [ 'string', true ],
//     settlement: 'string',
//     id_tipo_cultivo: [ 'number' ],
//     producto: [ 'string' ],
//     // the problem with id_localidad is that it comes
//     // from a hidden input, typed as string
//     id_localidad: 'any',
//     // geo stuff
//     geometry: [ 'object' ],
//     area: 'number',
//     perimeter: 'number'
//   }
// })

// export const Collection = AmpersandCollection.extend({
//   model: Model,
//   mainIndex: 'id'
// })

// max zoom 12 nominatim administrative levels:
// AR
// village
// state_district
// state
// country

// UY
// road
// country
// state

import AmpersandModel from 'ampersand-model'
import AmpersandCollection from 'ampersand-collection'

const Model = AmpersandModel.extend({
  props: {
    id: 'number',
    type: [ 'string', false, 'Feature' ],
    geometry: [ 'object', true ],
    properties: [ 'object', false, () => defaultProps() ]
  },
  session: {
    layer: 'any'
  },
  parse: function (data) {
    data.id = data.properties.id
    return data
  }
})

const Collection = AmpersandCollection.extend({
  model: Model,
  toGeoJSON: function (filter) {
    const plain = this.toJSON()
      .filter(feature => {
        return feature.geometry.type === 'Polygon'
      })
      .map(feature => {
        if (
          feature.properties &&
          feature.properties.cultivos &&
          feature.properties.cultivos.isCollection
        ) {
          feature.properties.cultivos = feature.properties.cultivos.toJSON()
        }
        return feature
      })
    return {
      type: 'FeatureCollection',
      features: filter ? plain.filter(filter) : plain
    }
  }
})

export {Collection, Model}
