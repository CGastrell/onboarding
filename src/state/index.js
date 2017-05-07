import State from 'ampersand-state'
import { Collection as Settlements } from 'model/settlement'
// import { Collection as Lots } from 'model/lot'
import { Collection as Cultivos } from 'model/cultivo'
import { Collection as TipoCultivos } from 'model/tipo-cultivo'
import cultivos from 'model/cultivo-data.json'
import tipocultivos from 'model/tipo-cultivo-data.json'

import Map from 'model/map'

const Global = State.extend({
  extraProperties: 'allow',
  props: {
    // maplibsready: [ 'boolean', false, false ],
    featureCollection: ['object', false, () => { return {type: 'FeatureCollection', features: []} }],
    mapstate: [ 'object', false, () => Map.model ]
  },
  // children: {
  //   user: User
  // },
  session: {
    cultivos: [ 'array', false, () => new Cultivos(cultivos) ],
    tipoCultivos: [ 'array', false, () => new TipoCultivos(tipocultivos) ],
    localidades: 'array'
  },
  collections: {
    // lots: Lots, // aka features
    settlements: Settlements
  }
})

export default Global
