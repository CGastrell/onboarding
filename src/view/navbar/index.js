import View from 'ampersand-view'
import NavbarForm from 'view/navbar/form'

const template = `
<nav class="navbar navbar-default navbar-static-top" style="flex-grow: 0;">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">Frontec</a>
    </div>
    <div class="collapse navbar-collapse" data-hook="navbar-collapse"></div>
  </div>
</nav>`

export default View.extend({
  template: template,
  autoRender: true,
  subviews: {
    form: {
      hook: 'navbar-collapse',
      constructor: NavbarForm
    }
  },
  // initialize: function () {
  //   console.log('navbar')
  // }
})
