import SelectView from 'ampersand-select-view'
import assign from 'lodash/assign'

// hay que reescribir el SelectView, es medio mersa
export default SelectView.extend({
  props: {
    value: 'any',
    styles: ['string', false, 'form-group']
  },
  initialize (opts) {
    SelectView.prototype.initialize.apply(this, arguments)
    this.onBlur = this.onBlur.bind(this)
  },
  bindDOMEvents: function () {
    SelectView.prototype.bindDOMEvents.apply(this, arguments)
    this.select.addEventListener('blur', this.onBlur, false)
  },
  onBlur: function () {
    var value = this.select.selectedIndex !== null && this.select.selectedIndex !== undefined && this.select.selectedIndex > -1
      ? this.select.options[this.select.selectedIndex].value
      : null

    if (this.options.isCollection && this.yieldModel) {
      value = this.getModelForId(value)
    }

    this.setValue(value)
  },
  template: `
    <div data-hook="styles">
      <label data-hook="label" class="control-label"></label>
      <select class="form-control select"></select>
      <div data-hook="message-container">
        <p data-hook="message-text" class="alert alert-warning"></p>
      </div>
    </div>`,
  bindings: assign({}, SelectView.prototype.bindings, {
    name: [{
      type: 'attribute',
      name: 'for',
      hook: 'label'
    }, {
      type: 'attribute',
      name: 'id',
      selector: 'select.select'
    }],
    styles: {
      type: 'attribute',
      name: 'class',
      hook: 'styles'
    }
  })
})
