import View from 'ampersand-view'
import App from 'ampersand-app'
import bootbox from 'components/bootbox'

const template = `<li><a href="login" data-hook="login">Link</a></li>`

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
      const loginForm = new LoginForm()
      loginForm.render()
      const formCallback = save => {
        console.log('argument callback')
        console.log(save)
        // event.preventDefault()
        const user = loginForm.el.querySelector('#inputEmail').value
        const pass = loginForm.el.querySelector('#inputPassword').value
        console.log(user, pass)

        // validation should run here and return
        // callback(true/false) accordingly
        if (user === '' || pass === '') {
          return false
        }
      }
      bootbox.form({
        title: 'Login/register',
        message: loginForm.el,
        buttons: [
          // {
          //   label: 'Ingresar / crear cuenta',
          //   className: 'btn btn-primary btn-block',
          //   callback: event => { return formCallback(true) && true }
          // }
        ]
      }, formCallback)
    }
  }
})

const LoginForm = View.extend({
  template: `
    <form class="form-signin">
      <h2 class="form-signin-heading">Registrarse/ingresar</h2>
      <label for="inputEmail" class="sr-only">Correo electronico</label>
      <input type="email" id="inputEmail" class="form-control" placeholder="alguien@algo.com" required autofocus>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="inputPassword" class="form-control" placeholder="password" required>
      <hr class="separator" />
      <a class="btn btn-primary btn-block">Ingresar / crear cuenta</a>
    </form>`
})
