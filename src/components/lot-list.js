import View from 'ampersand-view'
import App from 'ampersand-app'
import MapActions from 'actions/map'
import L from 'leaflet'
import ReportView from 'components/report'
import bootbox from 'bootbox'

const LotRow = View.extend({
  template: `
    <div class="lot-detail">
      <div>
        <strong data-hook="name" style="cursor: pointer;"></strong>
        <span class="glyphicon glyphicon-trash pull-right minibutton text-danger delete"></span>
        <span class="glyphicon glyphicon-pencil pull-right minibutton text-success edit"></span>
        <span class="glyphicon glyphicon-floppy-disk pull-right minibutton text-success save"></span>
        <span class='glyphicon glyphicon-zoom-in pull-right minibutton center'></span>
      </div>
      <div class="subtext">Establecimiento: <span data-hook="settlement"></span></div>
      <div class="subtext">Superficie: <span data-hook="area"></span> ha</div>
    </div>`,
  props: {
    editing: [ 'boolean', true, false ]
  },
  derived: {
    formattedArea: {
      deps: ['model.properties.area'],
      fn: function () {
        return (Number(this.model.properties.area) / 100 << 0) / 100
      }
    }
  },
  bindings: {
    'model.properties.nombre': {
      hook: 'name'
    },
    'formattedArea': {
      hook: 'area'
    },
    'model.properties.settlement': {
      hook: 'settlement'
    },
    editing: [
      {
        type: 'toggle',
        selector: '.edit',
        invert: true
      },
      {
        type: 'toggle',
        selector: '.save'
      }
    ]
  },
  events: {
    'click data-hook[name]': function (event) {
      event.preventDefault()
      const layer = App.Map.drawLayer.getLayer(this.model.properties.id)
      App.Map.openPolygonModal({target: layer})
    },
    'click .minibutton.center': function (event) {
      event.preventDefault()
      MapActions.zoomToFeature(this.model, true)
    },
    'click .minibutton.edit': function (event) {
      event.preventDefault()
      if (App.state.editingEnabled) return
      const layer = App.Map.drawLayer.getLayer(this.model.properties.id)
      if (layer) {
        layer.editing.enable()
        App.state.editingEnabled = true
        this.editing = true
        MapActions.hideDrawingToolbar()
        MapActions.hideEditingToolbar()
      }
    },
    'click .minibutton.save': function (event) {
      event.preventDefault()
      const layer = App.Map.drawLayer.getLayer(this.model.properties.id)
      if (layer) {
        layer.editing.disable()
        this.editing = false
        App.state.editingEnabled = false
        App.Map.map.fireEvent(L.Draw.Event.EDITED)
        MapActions.showDrawingToolbar()
        MapActions.showEditingToolbar()
      }
    },
    'click .minibutton.delete': function (event) {
      event.preventDefault()
      App.Map.drawLayer.removeLayer(App.Map.drawLayer.getLayer(this.model.properties.id))
      App.Map.map.fireEvent(L.Draw.Event.DELETED)
    }
  }
})
export default View.extend({
  template: `<div class="sidebar-main-container">
    <h4 class="sidebar-header">Lotes</h4>
    <div data-hook="list" class="sidebar-body"></div>
    <div data-hook="footer" class="sidebar-footer">
      <a role="button" class="btn btn-block btn-success ask" href="#">Pedir cotización</a>
    </div>
  </div>`,
  props: {
    sidebarInstance: 'any'
  },
  events: {
    'click .ask': function (event) {
      event.preventDefault()
      console.log('ask for')
      console.log(App.state.featureCollection.toGeoJSON())
      App.Map.rightSidebar.hide()
      // const closeConfirmAndZoom = (feature) => {
      //   MapActions.zoomToFeature(feature)
      //   if (this.confirmModal) {
      //     this.confirmModal.modal('hide')
      //   }
      // }
      const reportView = new ReportView({
        // lotSearchFn: closeConfirmAndZoom.bind(this)
      })
      reportView.render()

      this.confirmModal = bootbox.confirm({
        title: 'Solicitud de presupuesto',
        message: reportView.el,
        callback: this.requestReport,
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
  requestReport: function () {
    console.log(arguments)
    App.Map.rightSidebar.show()
  },
  initialize: function () {
    this.listenTo(App.state.featureCollection, 'change sync add reset remove', this.onFeatures)
    this.listenTo(App.state, 'change:modalIsOpen', this.onFeatures)
  },
  render: function () {
    this.renderWithTemplate(this)
    this.sidebarInstance.setContent(this.el)

    this.renderLotList()
  },
  renderLotList: function () {
    this.renderCollection(
      App.state.featureCollection,
      LotRow,
      this.queryByHook('list')
    )
  },
  onFeatures: function (state) {
    if (App.state.featureCollection.length > 0) {
      if (App.state.modalIsOpen) {
        this.sidebarInstance.hide()
      } else {
        this.sidebarInstance.show()
      }
    } else {
      this.sidebarInstance.hide()
    }
  }
})
