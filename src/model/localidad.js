import AmpersandCollection from 'ampersand-collection'
import AmpersandModel from 'ampersand-model'

export const Model = AmpersandModel.extend({
  props: {
    localidad: [ 'string', true ],
    id_localidad: 'number',
    geometry: 'object'
  }
})

export const Collection = AmpersandCollection.extend({
  model: Model,
  mainIndex: 'id_localidad'
})
