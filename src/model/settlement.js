import AmpersandCollection from 'ampersand-collection'
import AmpersandModel from 'ampersand-model'

export const Model = AmpersandModel.extend({
  props: {
    nombre: [ 'string', false, '' ]
  }
})

export const Collection = AmpersandCollection.extend({
  model: Model,
  mainIndex: 'nombre'
})
