import InputView from 'components/input-view'
import $ from 'jquery'

export default InputView.extend({
  initialize: function (options) {
    options = options || {}
    InputView.prototype.initialize.apply(this, arguments)
    this.afterSelect = options.afterSelect || function () {}
    this.dataset = options.options
    this.idAttribute = options.idAttribute || 'id'
    this.textAttribute = options.textAttribute || 'text'
  },
  handleSelect: function (item) {
    this.afterSelect(item)
    this.validate()
  },
  render: function () {
    InputView.prototype.render.apply(this, arguments)
    this.$input = $(this.input)

    this.$input.typeahead({
      source: this.dataset,
      // autoSelect: true,
      displayText: (item) => {
        return (typeof item !== 'undefined' && typeof item[this.textAttribute] !== 'undefined' && item[this.textAttribute]) || item
      },
      afterSelect: this.handleSelect.bind(this)
    })

    // this.$input.change(this.onChange.bind(this))
    // this.$input.blur(this.validate)
  }
})
