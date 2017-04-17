import AmpersandCollection from 'ampersand-collection'
import AmpersandModel from 'ampersand-model'

export const Model = AmpersandModel.extend({
  props: {
    nombre: [ 'string', true ],
    settlement: {
      type: 'state'
    },
    geometry: [ 'object' ],
    cultivo: [ 'string' ],
    producto: [ 'string' ],
    // geo stuff
    area: 'number',
    perimeter: 'number',
    id_localidad: 'number'
  }
})

export const Collection = AmpersandCollection.extend({
  model: Model,
  mainIndex: 'nombre'
})

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
