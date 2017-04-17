import AmpersandCollection from 'ampersand-collection'
import AmpersandModel from 'ampersand-model'

export const Model = AmpersandModel.extend({
  idAttribute: 'id',
  props: {
    id: 'number',
    nombre: [ 'string', true ],
    settlement: 'string',
    id_tipo_cultivo: [ 'number' ],
    producto: [ 'string' ],
    // the problem with id_localidad is that it comes
    // from a hidden input, typed as string
    id_localidad: 'any',
    // geo stuff
    geometry: [ 'object' ],
    area: 'number',
    perimeter: 'number'
  }
})

export const Collection = AmpersandCollection.extend({
  model: Model,
  mainIndex: 'id'
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
