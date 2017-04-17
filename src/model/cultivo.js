import AmpersandModel from 'ampersand-model'
import AmpersandCollection from 'ampersand-collection'

export const Model = AmpersandModel.extend({
  idAttribute: 'id_cultivo',
  props: {
    id_cultivo: 'number',
    nombre: 'string',
    descripcion: 'string',
    variedad: 'string',
    id_tipo_cultivo: 'number'
  }
})

export const Collection = AmpersandCollection.extend({
  mainIndex: 'id_cultivo',
  model: Model
})
