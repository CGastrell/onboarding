import State from 'ampersand-state'
import { Collection as Settlements } from 'model/settlement'
import { Collection as Lots } from 'model/lot'
import { Collection as Localidades } from 'model/localidad'
import { Collection as Cultivos } from 'model/cultivo'
import { Collection as TipoCultivos } from 'model/tipo-cultivo'
import MapModel from 'model/map'

const Global = State.extend({
  extraProperties: 'allow',
  props: {
    maplibsready: [ 'boolean', false, false ],
    features: ['array', false, () => []],
    user: ['object', false, () => { return {} }],
    mapstate: [ 'object', false, () => new MapModel() ]
  },
  collections: {
    lots: Lots,
    settlements: Settlements,
    localidades: Localidades,
    cultivos: Cultivos,
    tipoCultivos: TipoCultivos
  }
})

export default Global
