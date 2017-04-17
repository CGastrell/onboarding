import AmpersandModel from 'ampersand-model'
import AmpersandCollection from 'ampersand-collection'

export const Model = AmpersandModel.extend({
  idAttribute: 'id_tipo_cultivo',
  props: {
    id_tipo_cultivo: 'number',
    nombre: 'string',
    gruesa: 'boolean'
  }
})

export const Collection = AmpersandCollection.extend({
  mainIndex: 'id_tipo_cultivo',
  model: Model
})
