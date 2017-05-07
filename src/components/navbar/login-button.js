import View from 'ampersand-view'
import bootbox from 'components/bootbox'
import LoginForm from 'components/login-form'

const template = `<li><a href="login" data-hook="login">Ingresar</a></li>`

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
      type: 'toggle',
      invert: true
    }
  },
  events: {
    'click a[data-hook=login]': function (event) {
      event.preventDefault()
      this.loginForm = new LoginForm({parent: this})
      this.loginForm.render()

      this.loginModal = bootbox.dialog({
        title: 'Cree una cuenta o ingrese sus credenciales',
        message: this.loginForm.el,
        buttons: [],
        onEscape: true,
        closeButton: true
      })
      const self = this
      this.loginModal.on('hide.bs.modal', function (event) {
        self.loginForm.remove()
      })
    }
  }
})
