import AmpersandView from 'ampersand-view'
import LotForm from './lot-form'
// import Lot from 'model/lot'

export default AmpersandView.extend({
  template: `
  <div data-hook="lot-form" class="clearfix">
    <div data-hook="form-container" class="col-md-6"></div>
    <div data-hook="side-info" class="col-md-6">
    <dl class="dl-horizontal">
      <dt>Nombre</dt>
      <dd>lotname</dd>
    </dl>
    </div>
  </div>`,
  props: {
    layer: [ 'object', true ]
  },
  // events: {
  //   'click .btn-danger': function () {
  //     console.log('macarena')
  //   }
  // },
  subviews: {
    form: {
      hook: 'form-container',
      prepareView: function (el) {
        this.formView = new LotForm({
          layer: this.layer
        })
        return this.formView
      }
    }
  }
})
