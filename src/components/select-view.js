import SelectView from 'ampersand-select-view'
import assign from 'lodash/assign'

// hay que reescribir el SelectView, es medio mersa
export default SelectView.assign({
  props: {
    value: 'any',
    styles: ['string', false, 'col-sm-6 form-group']
  },
  initialize (opts) {
    SelectView.prototype.initialize.apply(this, arguments)
    this.styles += ' amp-input'
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
