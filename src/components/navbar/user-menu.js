import View from 'ampersand-view'
import App from 'ampersand-app'

const template = `
  <li class="dropdown">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
    <ul class="dropdown-menu">
      <li role="separator" class="divider"></li>
      <li><a href="logout" data-hook="logout">Salir</a></li>
    </ul>
  </li>`

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
      event.preventDefault()
      App.state.user.clear()
    }
  },
  render: function () {
    this.renderWithTemplate(this)
  }
})
