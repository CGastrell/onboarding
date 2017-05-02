import View from 'ampersand-view'
import App from 'ampersand-app'

import 'bootstrap-3-typeahead'

const template = `
<ul class="nav navbar-nav navbar-right" data-hook="user-menu">
  <li class="dropdown">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
    <ul class="dropdown-menu">
      <li role="separator" class="divider"></li>
      <li><a href="#" data-hook="logout">Salir</a></li>
    </ul>
  </li>
</ul>`

export default View.extend({
  // autoRender: true, // a subview with autoRender won't work
  derived: {
    visible: {
      deps: ['model.token'],
      fn: function () {
        return Boolean(this.model.token)
      }
    }
  },
  template: template,
  bindings: {
    visible: {
      type: 'toggle'
    }
  },
  events: {
    'click a[data-hook=logout]': function (event) {
      App.state.user.clear()
    }
  },
  render: function () {
    window.aaa = this
    this.renderWithTemplate(this)
  }
})
