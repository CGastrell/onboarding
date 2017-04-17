import AmpersandView from 'ampersand-view'
import LotForm from './lot-form'

export default AmpersandView.extend({
  template: `
  <div data-hook="lot-form" class="clearfix">
    <div data-hook="form-container" class="col-md-6"></div>
  </div>`,
  subviews: {
    form: {
      hook: 'form-container',
      prepareView: function (el) {
        return new LotForm({
          model: this.model
        })
      }
    }
  }
})
