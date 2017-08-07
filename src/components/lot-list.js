import View from 'ampersand-view'
import App from 'ampersand-app'
import MapActions from 'actions/map'
import L from 'leaflet'
import ReportView from 'components/report'
import $ from 'jquery'
import 'bootstrap/js/tooltip'

const SettlementRow = View.extend({
  template: `
    <div style="padding-top: 10px; padding-bottom: 15px;">
      <div><strong data-hook="settlement"></strong></div>
      <div data-hook="lots" style="padding-left: 4px;"></div>
    </div>`,
  bindings: {
    'model.nombre': {
      hook: 'settlement'
    }
  },
  render: function () {
    this.renderWithTemplate(this)
    const self = this
    this.renderCollection(
      App.state.featureCollection,
      LotRow,
      this.queryByHook('lots'),
      {
        filter: function (lot) {
          return lot.properties.settlement === self.model.nombre
        }
      }
    )
  }
})
const LotRow = View.extend({
  template: `
    <div class="lot-detail">
      <div>
        <div class="subtext"><strong data-hook="settlement"></strong></div>
        <strong data-hook="name" style="cursor: pointer;"></strong>
        <span
          class="glyphicon glyphicon-trash pull-right minibutton text-danger delete"
          data-toggle="tooltip"
          title="Borrar lote"></span>
        <span
          class="glyphicon glyphicon-pencil pull-right minibutton text-success edit"
          data-toggle="tooltip"
          title="Modificar geometría"></span>
        <span
          class="glyphicon glyphicon-floppy-disk pull-right minibutton text-success save"
          data-toggle="tooltip"
          title="Finalizar edición"></span>
        <span
          class="glyphicon glyphicon-zoom-in pull-right minibutton center"
          data-toggle="tooltip"
          title="Acercar"></span>
      </div>
      <div class="subtext">Superficie: <span data-hook="area"></span> ha</div>
    </div>`,
  props: { editing: [ 'boolean', true, false ] },
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
    // 'model.properties.settlement': {
    //   hook: 'settlement'
    // },
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
      if (App.state.editingEnabled) return
      App.Map.drawLayer.removeLayer(App.Map.drawLayer.getLayer(this.model.properties.id))
      App.Map.map.fireEvent(L.Draw.Event.DELETED)
    }
  },
  render: function () {
    this.renderWithTemplate(this)
    $('[data-toggle="tooltip"]', this.el).tooltip()
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
      const reportView = new ReportView()
      reportView.render()
      App.Map.rightSidebar.hide()
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

    this.renderCollection(
      App.state.settlements,
      SettlementRow,
      this.queryByHook('list')
    )
  },
  // renderLotList: function () {
  //   this.renderCollection(
  //     App.state.settlements,
  //     SettlementRow,
  //     this.queryByHook('list')
  //   )
  // },
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
