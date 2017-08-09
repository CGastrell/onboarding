import App from 'ampersand-app'
import FormView from 'ampersand-form-view'
import InputView from 'components/input-view'
import CustomSelectView from './select-with-buttons-view'
import Select2View from 'components/select2-view'

export default FormView.extend({
  props: {
    layer: [ 'object', true ],
    datamodel: [ 'object' ]
  },
  initialize: function (options) {
    this.datamodel = this.layer.feature.properties

    this.fields = [
      new InputView({
        name: 'nombre',
        label: 'Nombre',
        value: this.datamodel.nombre,
        styles: 'form-group',
        required: true,
        invalidClass: 'text-danger',
        validityClassSelector: '.control-label'
      }),
      new CustomSelectView({
        name: 'settlement',
        label: 'Establecimiento',
        value: this.datamodel.settlement,
        styles: 'form-group',
        required: true,
        requiredMessage: 'Debe seleccionar un establecimiento',
        invalidClass: 'text-danger',
        options: App.state.settlements,
        yieldModel: false,
        idAttribute: 'nombre',
        textAttribute: 'nombre',
        validityClassSelector: '.control-label'
      }),
      new Select2View({
        label: 'Cultivos',
        name: 'cultivos',
        multiple: true,
        tags: true,
        required: true,
        options: App.state.cultivos,
        styles: 'form-group',
        value: this.datamodel.cultivos,
        unselectedText: 'Seleccione hasta 2 cultivos',
        idAttribute: 'id_cultivo',
        textAttribute: 'nombre',
        requiredMessage: 'Ingrese al menos un cultivo',
        invalidClass: 'text-danger',
        validityClassSelector: '.control-label',
        yieldModel: true
      })
    ]
    FormView.prototype.initialize.apply(this, arguments)
  },
  render: function () {
    FormView.prototype.render.apply(this, arguments)

    setTimeout(() => this.query('input').focus(), 250)
  }
})
