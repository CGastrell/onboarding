// import AmpersandCollection from 'ampersand-collection'
// import AmpersandModel from 'ampersand-model'

export default {
  get model () {
    return {
      id: 0,
      type: 'Feature',
      geometry: {},
      properties: {
        id: 0,
        nombre: '',
        settlement: '',
        id_tipo_cultivo: 0,
        productos: [],
        id_localidad: 0,
        mol: false,
        axa: false,
        cosecha: false,
        // geo stuff
        area: 0,
        perimeter: 0
      }
    }
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
