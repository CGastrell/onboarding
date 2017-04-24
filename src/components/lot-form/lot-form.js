import App from 'ampersand-app'
import FormView from 'ampersand-form-view'
import InputView from 'components/input-view'
import TypeaheadView from 'components/input-view/typeahead'
import CustomSelectView from './select-with-buttons-view'
import SelectView from 'components/select-view'
import CheckboxView from 'components/checkbox-view'

// import TagsInputView from 'components/input-view/tagsinput'
// import 'styles/bootstrap-tagsinput.css'

export default FormView.extend({
  props: {
    layer: [ 'object', true ],
    datamodel: [ 'object' ]
  },
  initialize: function (options) {
    this.datamodel = this.layer.feature.properties
    this.idLocalidadInputView = new InputView({
      name: 'id_localidad',
      type: 'hidden',
      value: this.datamodel.id_localidad
    })

    this.fields = [
      new InputView({
        name: 'nombre',
        label: 'Nombre',
        value: this.datamodel.nombre,
        required: true,
        invalidClass: 'text-danger',
        validityClassSelector: '.control-label'
      }),
      new CustomSelectView({
        name: 'settlement',
        label: 'Establecimiento',
        required: true,
        requiredMessage: 'Debe seleccionar un establecimiento',
        value: this.datamodel.settlement,
        invalidClass: 'text-danger',
        options: App.state.settlements,
        yieldModel: false,
        idAttribute: 'nombre',
        textAttribute: 'nombre',
        validityClassSelector: '.control-label'
      }),
      new SelectView({
        name: 'id_tipo_cultivo',
        label: 'Cultivo',
        required: true,
        requiredMessage: 'Necesita especificar un cultivo',
        value: this.datamodel.id_cultivo,
        invalidClass: 'text-danger',
        options: App.state.tipoCultivos,
        yieldModel: false,
        idAttribute: 'id_tipo_cultivo',
        textAttribute: 'nombre',
        validityClassSelector: '.control-label'
      }),
      this.idLocalidadInputView,
      // TODO: after selecting a loc, if you type and re-select,
      // the label will remain as if it wasn't valid
      new TypeaheadView({
        name: 'localidad',
        label: 'Localidad',
        placeholder: 'Escriba el nombre de una localidad',
        required: true,
        requiredMessage: 'Debe seleccionar una localidad de la lista',
        value: this.datamodel.localidad,
        invalidClass: 'text-danger',
        options: App.state.localidades,
        idAttribute: 'id_localidad',
        textAttribute: 'localidad',
        validityClassSelector: '.control-label',
        afterSelect: (item) => {
          // set the hidden input value to the id of the loc match
          this.idLocalidadInputView.setValue(item.id_localidad)
        },
        tests: [
          value => {
            if (!this.idLocalidadInputView.value) {
              return 'Debe seleccionar una localidad'
            }
            const casted = Number(this.idLocalidadInputView.value)
            const definedLoc = App.state.localidades.find(loc => loc.id_localidad === casted)
            if (!definedLoc || definedLoc.localidad !== value) {
              return 'La localidad no fue seleccionada del listado'
            }
            return ''
          }
        ]
      }),
      new CheckboxView({
        name: 'axa',
        label: 'Ambientacion',
        value: this.datamodel.axa
      }),
      new CheckboxView({
        name: 'mol',
        label: 'Monitoreo OnLine',
        value: this.datamodel.mol
      }),
      new CheckboxView({
        name: 'cosecha',
        label: 'Cosecha',
        value: this.datamodel.cosecha
      })

      // no lo pude hacer andar
      // new TagsInputView({
      //   name: 'id_localidad2',
      //   label: 'Localidad 2',
      //   // placeholder: 'Comience a escribir',
      //   required: true,
      //   requiredMessage: 'Debe seleccionar una localidad',
      //   // value: this.datamodel.id_localidad,
      //   itemValue: 'id_localidad',
      //   itemText: 'localidad',
      //   maxTags: 1,
      //   typeahead: {
      //     source: App.state.localidades.toJSON()
      //   },
      //   invalidClass: 'text-danger',
      //   validityClassSelector: '.control-label'
      // })
    ]
    FormView.prototype.initialize.apply(this, arguments)
  },
  render: function () {
    FormView.prototype.render.apply(this, arguments)

    setTimeout(() => this.query('input').focus(), 250)
  }
})
