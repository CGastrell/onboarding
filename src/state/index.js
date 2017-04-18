import State from 'ampersand-state'
import { Collection as Settlements } from 'model/settlement'
import { Collection as Lots } from 'model/lot'
// import { Collection as Cultivos } from 'model/cultivo'
// import { Collection as TipoCultivos } from 'model/tipo-cultivo'
import cultivos from 'model/cultivo-data.json'
import tipocultivos from 'model/tipo-cultivo-data.json'

import mapModel from 'model/map'

const Global = State.extend({
  extraProperties: 'allow',
  props: {
    // maplibsready: [ 'boolean', false, false ],
    features: ['array', false, () => []],
    user: ['object', false, () => { return {} }],
    mapstate: [ 'object', false, () => mapModel() ]
  },
  session: {
    cultivos: [ 'array', false, () => cultivos ],
    tipoCultivos: [ 'array', false, () => tipocultivos ],
    localidades: 'array'
  },
  collections: {
    lots: Lots, // aka features
    settlements: Settlements
  }
})

export default Global
