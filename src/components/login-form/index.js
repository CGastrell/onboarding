import App from 'ampersand-app'
import View from 'ampersand-view'
import isEmail from 'validator/lib/isEmail'
import bootbox from 'components/bootbox'
import './login-form.css'
// import preloadingImage from './preloader.gif'
import { Auth as AuthActions, User as UserActions } from 'actions'

export default View.extend({
  template: `
    <form class="form-signin">
      <label for="inputEmail" class="sr-only">Correo electronico</label>
      <input type="email" name="email" id="inputEmail" class="form-control" placeholder="alguien@algo.com" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" name="password" id="inputPassword" class="form-control" placeholder="contraseña" required>
      <hr class="separator" />
      <div class="well well-small">
        <p>Enviaremos los presupuestos que solicite a la cuenta de correo que indique</p>
      </div>
      <button role="button" data-hook="login" class="btn btn-success btn-block">Ingresar / crear cuenta</button>
    </form>`,
  events: {
    'click button[data-hook=login]': function (event) {
      event.preventDefault()
      const user = this.el.querySelector('#inputEmail').value
      const pass = this.el.querySelector('#inputPassword').value
      if (!user || !pass || !isEmail(user)) {
        bootbox.alert('Por favor ingrese un usuario y contraseña válidos')
        return
      }
      App.progress.start()
      AuthActions.login(user, pass)
        .then(UserActions.fetchUserData.bind(UserActions))

      this.parent.loginModal.modal('hide')
    }
  },
  render: function () {
    this.renderWithTemplate(this)
    this.el.querySelector('input').focus()
  }
})
