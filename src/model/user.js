import AmpersandModel from 'ampersand-model'

export default AmpersandModel.extend({
  props: {
    email: [ 'string', false, '' ],
    nombre: [ 'string', false, '' ],
    token: 'string',
    id: 'number'
  }
})
