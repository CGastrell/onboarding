import View from 'ampersand-view'
import AuthActions from 'actions/auth'
import ReportView from 'components/report'
import bootbox from 'components/bootbox'
import UserActions from 'actions/user'
import MapActions from 'actions/map'

const template = `
  <li class="dropdown">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span data-hook="label">Dropdown</span> <span class="caret"></span></a>
    <ul class="dropdown-menu">
      <li><a href="#" data-hook="reporte">Reporte</a></li>
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
    },
    label: {
      deps: ['model.email'],
      fn: function () {
        return this.model.email
      }
    }
  },
  template: template,
  bindings: {
    label: {
      hook: 'label'
    },
    visible: {
      type: 'toggle'
    }
  },
  events: {
    'click a[data-hook=logout]': function (event) {
      event.preventDefault()
      AuthActions.logout()
    },
    'click a[data-hook=reporte]': function (event) {
      event.preventDefault()
      const closeConfirmAndZoom = (feature) => {
        MapActions.zoomToFeature(feature)
        if (this.confirmModal) {
          this.confirmModal.modal('hide')
        }
      }
      const reportView = new ReportView({
        lotSearchFn: closeConfirmAndZoom.bind(this)
      })
      reportView.render()

      this.confirmModal = bootbox.confirm({
        title: 'Lotes',
        message: reportView.el,
        callback: UserActions.saveUserData,
        buttons: {
          confirm: {
            label: 'Pedir presupuesto',
            className: 'btn-success'
          },
          cancel: {
            label: 'Cerrar'
          }
        }
      })
    }
  },
  render: function () {
    this.renderWithTemplate(this)
  }
})
