import State from 'ampersand-state'
import { Collection as SettlementCollection } from 'model/settlement'
import { Collection as LotCollection } from 'model/lot'

const Global = State.extend({
  extraProperties: 'allow',
  props: {
    features: ['array', false, () => []],
    user: ['object', false, () => { return {} }]
  },
  collections: {
    lots: LotCollection,
    settlements: SettlementCollection
  }
})

export default Global
