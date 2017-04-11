import AmpersandCollection from 'ampersand-collection'
import AmpersandModel from 'ampersand-model'

const SettlementModel = AmpersandModel.extend({
  props: {
    nombre: [ 'string', false, '' ]
  }
})

const SettlementCollection = AmpersandCollection.extend({
  model: SettlementModel,
  mainIndex: 'nombre'
})

export { SettlementCollection as Collection }
export { SettlementModel as Model }
