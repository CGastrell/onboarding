import View from 'ampersand-view'
import matchesSelector from 'matches-selector'
import dom from 'ampersand-dom'
import 'select2'
import 'select2/dist/js/i18n/es'
import $ from 'jquery'

import 'select2/dist/css/select2.css'

function getMatches (el, selector) {
  if (selector === '') return [el]
  var matches = []
  if (matchesSelector(el, selector)) matches.push(el)
  return matches.concat(Array.prototype.slice.call(el.querySelectorAll(selector)))
}

export default View.extend({
  template: `
    <div>
      <label data-hook="label" class="control-label"></label>
      <select class="form-control select" style="width:100%"></select>
      <div data-hook="message-container">
        <p data-hook="message-text" class="alert alert-warning"></p>
      </div>
    </div>`,
  bindings: {
    multiple: {
      type: 'booleanAttribute',
      selector: 'select',
      name: 'multiple'
    },
    name: {
      type: 'attribute',
      selector: 'select',
      name: 'name'
    },
    tabindex: {
      type: 'attribute',
      selector: 'select',
      name: 'tabindex'
    },
    label: [{
      hook: 'label'
    }, {
      type: 'toggle',
      hook: 'label'
    }],
    message: {
      type: 'text',
      hook: 'message-text'
    },
    showMessage: {
      type: 'toggle',
      hook: 'message-container'
    },
    autofocus: { // ?
      type: 'booleanAttribute',
      name: 'autofocus',
      selector: 'select'
    }
  },
  props: {
    tokenSeparator: ['array', false, () => { return [] }],
    tags: ['boolean', false, false],
    multiple: ['boolean', false, false],
    name: 'string',
    inputValue: 'any',
    startingValue: 'any',
    options: 'any', // should be any object with array functions interface
    idAttribute: ['string', false, 'id'],
    textAttribute: ['string', false, 'text'],
    type: ['string', true, 'text'],
    unselectedText: ['string', true, ''],
    label: ['string', true, ''],
    required: ['boolean', true, false],
    autofocus: ['boolean', true, false],
    shouldValidate: ['boolean', true, false],
    message: ['string', true, ''],
    requiredMessage: ['string', true, 'This field is required.'],
    validClass: ['string', true, 'input-valid'],
    invalidClass: ['string', true, 'input-invalid'],
    validityClassSelector: ['string', true, 'select'],
    tabindex: ['number', true, 0],
    allowCreateTags: ['boolean', false, false],
    createTags: ['any', false, () => {
      // default create tags function
      return function (params) {
        return {
          id: params.term,
          text: params.term
        }
      }
    }]
  },
  derived: {
    value: {
      deps: ['inputValue'],
      fn: function () {
        return this.inputValue
      }
    },
    valid: {
      cache: false,
      deps: ['inputValue'],
      fn: function () {
        return !this.runTests()
        // this.message = this.getErrorMessage()
        // return this.message === ''
      }
    },
    showMessage: {
      deps: ['message', 'shouldValidate'],
      fn: function () {
        return this.shouldValidate && Boolean(this.message)
      }
    },
    changed: {
      deps: ['inputValue', 'startingValue'],
      fn: function () {
        return this.inputValue !== this.startingValue
      }
    },
    validityClass: {
      deps: ['valid', 'validClass', 'invalidClass', 'shouldValidate'],
      fn: function () {
        if (!this.shouldValidate) {
          return ''
        } else {
          return this.valid ? this.validClass : this.invalidClass
        }
      }
    }
  },
  initialize: function (spec) {
    spec || (spec = {})
    this.tests = spec.tests || []
    var value = spec.value
    this.startingValue = value
    this.inputValue = value
    // this.handleChange = this.handleChange.bind(this)
    this.handleInputChanged = this.handleInputChanged.bind(this)
  },
  reset: function () {
    // this will reset the value to the original value and
    // trigger change on the select2 element for proper UI update
    this.$select.val(this.startingValue).trigger('change')
  },
  render: function () {
    this.renderWithTemplate(this)
    this.$select = $(this.query('select')).first()

    const select2setup = {
      placeholder: this.unselectedText,
      tags: this.tags,
      tokenSeparator: this.tokenSeparator,
      maximumSelectionLength: 2,
      language: 'es',
      createTag: (() => {
        // https://select2.github.io/options.html#can-i-control-when-tags-are-created
        if (!this.allowCreateTags) {
          return function () { return null } // disable tag creation
        } else {
          return this.createTags
        }
      })()
    }

    if (this.options) {
      select2setup.data = this.options.map(value => {
        return {
          text: value[this.textAttribute],
          id: value[this.idAttribute]
        }
      })
    }

    // select2 instantiate
    this.$select.select2(select2setup)

    this.listenTo(this, 'change:valid', this.reportToParent)
    this.listenTo(this, 'change:validityClass', this.validityClassChanged)

    // darn jquery event cannot be handled by
    // a method on this object
    this.$select.on('change', this.handleInputChanged)

    this.setValues(this.inputValue)
  },
  setValues (items) {
    if (!items) {
      this.$select.val(null)
    } else {
      var data
      if (items.isCollection) {
        // items are treated as models
        data = items.map(model => model.get(this.idAttribute))
      } else if (Array.isArray(items)) {
        // items are treated as plain objects
        data = items.map(item => {
          // only if they are objects...
          if (item[this.idAttribute]) {
            return item[this.idAttribute]
          } else {
            return item
          }
        })
      } else {
        // items is a single item
        data = items
      }

      this.$select.val(data)
    }
    if (data.length) this.$select.trigger('change')
  },
  validityClassChanged: function (view, newClass) {
    var oldClass = view.previousAttributes().validityClass
    getMatches(this.el, this.validityClassSelector).forEach(function (match) {
      dom.switchClass(match, oldClass, newClass)
    })
  },
  reportToParent: function () {
    if (this.parent) this.parent.update(this)
  },
  clear: function () {
    this.$select
      .val([])
      .trigger('change')
  },
  getErrorMessage: function () {
    var message = ''
    if (this.required && !this.value) {
      return this.requiredMessage
    } else if (Array.isArray(this.value) && this.value.length === 0) {
      return this.requiredMessage
    } else {
      (this.tests || []).some(function (test) {
        message = test.call(this, this.value) || ''
        return message
      }, this)
      return message
    }
  },
  // `change` event handler
  handleInputChanged: function () {
    this.directlyEdited = true
    this.inputValue = this.$select.val()
  },
  // handleChange: function () {
  //   console.log('changehandler')
  //   if (this.inputValue && this.changed) {
  //     this.shouldValidate = true
  //   }
  //   this.runTests()
  // },
  runTests: function () {
    var message = this.getErrorMessage()
    if (!message && this.inputValue && this.changed) {
      // if it's ever been valid,
      // we want to validate from now
      // on.
      this.shouldValidate = true
    }
    this.message = message
    return message
  },
  beforeSubmit: function () {
    this.inputValue = this.$select.val()

    // at the point where we've tried
    // to submit, we want to validate
    // everything from now on.
    this.shouldValidate = true
    this.runTests()
  }
})
