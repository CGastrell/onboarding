import App from 'ampersand-app'
import View from 'ampersand-view'
import NavbarForm from './form'
import UserMenu from './user-menu'
import LoginButton from './login-button'
import 'bootstrap/js/dropdown'
import 'bootstrap/js/collapse'

const template = `
<nav class="navbar navbar-default navbar-static-top" style="flex-grow: 0;">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#nav1" aria-expanded="false">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="#">Frontec</a>
    </div>
    <div id="nav1" class="collapse navbar-collapse" data-hook="navbar-collapse">
      <ul class="nav navbar-nav navbar-right" data-hook="user-menu">
      </ul>
    </div>
  </div>
</nav>`

export default View.extend({
  template: template,
  autoRender: true,
  subviews: {
    form: {
      hook: 'navbar-collapse',
      constructor: NavbarForm
    },
    userMenu: {
      hook: 'user-menu',
      prepareView: function (el) {
        return new UserMenu({
          model: App.state.user
        })
      }
    },
    loginButton: {
      hook: 'user-menu',
      prepareView: function (el) {
        return new LoginButton({
          model: App.state.user
        })
      }
    }
  }
})

// <ul class="nav navbar-nav navbar-right" data-hook="user-menu">
//   <li class="dropdown">
//     <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span class="caret"></span></a>
//     <ul class="dropdown-menu">
//       <li role="separator" class="divider"></li>
//       <li><a href="#">Salir</a></li>
//     </ul>
//   </li>
// </ul>
