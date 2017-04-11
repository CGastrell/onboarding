import AmpersandCollection from 'ampersand-collection'
import AmpersandModel from 'ampersand-model'

const LotModel = AmpersandModel.extend({
  props: {
    nombre: [ 'string', false, '' ],
    settlement: {
      type: 'state'
    },
    geometry: [ 'array', false, () => [] ],
    cultivo: [ 'string', false, '' ]
  }
})

const LotCollection = AmpersandCollection.extend({
  model: LotModel,
  mainIndex: 'nombre'
})

export { LotCollection as Collection }
export { LotModel as Model }
