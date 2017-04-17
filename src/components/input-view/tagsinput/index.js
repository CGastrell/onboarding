import $ from 'jquery'
import 'bootstrap-tagsinput'

import InputView from 'components/input-view'

export default InputView.extend({
  props: {
    data: 'object',
    name: ['string', true, 'tags'],
    maxTags: 'number',
    itemValue: ['any', false, null],
    itemText: ['any', false, null],
    required: ['boolean'],
    typeahead: 'object',
    freeInput: ['boolean', false, false],
    // change events does not trigger by itself on arrays. force with trigger
    tagsinput: ['array', false, () => []]
  },
  initialize: function () {
    this.tests = [
      function () {
        var tagsinput = this.tagsinput
        if (
          !Array.isArray(tagsinput) ||
          tagsinput.length <= 0
        ) return this.requiredMessage
      }
    ]

    InputView.prototype.initialize.apply(this, arguments)

    if (this.inputValue) {
      var tags = this.inputValue.split(',')
      tags.forEach(tag => {
        this.tagsinput.push(tag)
      })
    }
  },
  derived: {
    value: {
      deps: ['tagsinput'],
      fn: function () {
        console.log(this.tagsinput)
        return this.tagsinput
      }
    }
  },
  render: function () {
    InputView.prototype.render.apply(this, arguments)
    const $input = $(this.input)

    const self = this
    const options = {
      maxTags: this.maxTags,
      freeInput: this.freeInput,
      typeahead: {
        display: ''
      },
      confirmKeys: [13, 35, 44] // set the #, return and , keys as confirm keys
    }
    if (this.itemValue) options.itemValue = this.itemValue
    if (this.itemText) options.itemText = this.itemText
    if (this.typeahead) options.typeahead = Object.assign({}, options.typeahead, this.typeahead)

    $input.tagsinput(options)

    $input.on('itemAdded', function (event) {
      const items = $input.tagsinput('items')
      self.set('tagsinput', items)
      self.trigger('change:tagsinput', this, items)
    })

    $input.on('itemRemoved', function (event) {
      const items = $input.tagsinput('items')
      self.set('tagsinput', items)
      self.trigger('change:tagsinput', this, items)
    })

    this.$input = $input
  },
  events: {
    'blur .tt-input': 'onTagsinputBlur'
  },
  onTagsinputBlur: function () {
    this.setValue([this.$input.tagsinput('input').val()])
  },
  setValue: function (value) {
    InputView.prototype.setValue.apply(this, arguments)

    if (this.$input) {
      if (value instanceof Array) {
        value.forEach(tag => {
          this.$input.tagsinput('add', tag)
        })
      } else if (value instanceof String) {
        this.$input.tagsinput('add', value)
      }
    }
  },
  clear: function () {
    InputView.prototype.initialize.apply(this, arguments)

    // empty arrat
    this.tagsinput.length = 0
    this.tagsinput = []
    this.$input.tagsinput('removeAll')
    this.trigger('change:tagsinput')
  }
})
