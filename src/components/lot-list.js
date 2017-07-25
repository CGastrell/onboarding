import View from 'ampersand-view'
import App from 'ampersand-app'

const LotRow = View.extend({
  template: `
    <div class="lot-detail">
      <div>
        <strong data-hook="name"></strong>
        <span class="glyphicon glyphicon-trash pull-right minibutton text-danger delete"></span>
        <span class="glyphicon glyphicon-edit pull-right minibutton text-success edit"></span>
        <span class='glyphicon glyphicon-eye-open pull-right minibutton center'></span>
      </div>
      <div class="subtext">Establecimiento: <span data-hook="settlement"></span></div>
      <div class="subtext">Superficie: <span data-hook="area"></span> ha</div>
    </div>`,
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
    }
  },
  events: {
    'click .minibutton.center': function (event) {
      console.log('center')
    },
    'click .minibutton.edit': function (event) {
      console.log('edit')
    },
    'click .minibutton.delete': function (event) {
      console.log('delete')
    }
  }
})
export default View.extend({
  template: `<div>
    <h4>Lotes</h4>
    <div data-hook="list"></div>
  </div>`,
  props: {
    sidebarInstance: 'any'
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
    if (this.list) this.list.remove()
    this.renderCollection(
      App.state.featureCollection,
      LotRow,
      this.queryByHook('list')
    )
  },
  onFeatures: function (state) {
    console.log('modalIsOpen', App.state.modalIsOpen)
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
