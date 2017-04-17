import InputView from 'ampersand-input-view'
import extend from 'lodash/extend'

/**
 *
 * This is a custom template InputView
 * that use <div> instead of <label>
 *
 */
module.exports = InputView.extend({
  template: `
    <div>
      <label data-hook="label" class="control-label"></label>
      <input class="form-input form-control">
      <div data-hook="message-container" class="message message-below alert alert-warning">
        <p data-hook="message-text"></p>
      </div>
    </div>`,
  // <div data-hook="input-container" style="position:relative">
  // </div>
  props: {
    styles: [ 'string', false, 'form-group' ]
  },
  initialize () {
    this.requiredMessage = 'Este campo no puede estar vacío'
    InputView.prototype.initialize.apply(this, arguments)
    this.validate = this.beforeSubmit.bind(this)
    this.styles += ' amp-input'
  },
  events: {
    'blur input': 'validate'
  },
  bindings: extend({}, InputView.prototype.bindings, {
    styles: {
      type: 'attribute',
      name: 'class'
    }
  })
})
