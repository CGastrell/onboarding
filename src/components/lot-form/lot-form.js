import App from 'ampersand-app'
import FormView from 'ampersand-form-view'
import InputView from 'components/input-view'
import TypeaheadView from 'components/input-view/typeahead'
import CustomSelectView from './select-with-buttons-view'
import SelectView from 'components/select-view'

// import TagsInputView from 'components/input-view/tagsinput'
// import 'styles/bootstrap-tagsinput.css'

export default FormView.extend({
  initialize: function () {
    this.idLocalidadInputView = new InputView({
      name: 'id_localidad',
      type: 'hidden',
      value: this.model.id_localidad
    })

    this.fields = [
      new InputView({
        name: 'nombre',
        label: 'Nombre',
        value: this.model.nombre,
        required: true,
        invalidClass: 'text-danger',
        validityClassSelector: '.control-label'
      }),
      new CustomSelectView({
        name: 'settlement',
        label: 'Establecimiento',
        required: true,
        requiredMessage: 'Debe seleccionar un establecimiento',
        value: this.model.settlement,
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
        value: this.model.id_cultivo,
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
        placeholder: 'Comience a tipear',
        required: true,
        requiredMessage: 'Debe seleccionar una localidad de la lista',
        value: this.model.localidad,
        invalidClass: 'text-danger',
        options: App.state.localidades.toJSON(),
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
            const definedLoc = App.state.localidades.get(this.idLocalidadInputView.value)
            if (!definedLoc || definedLoc.localidad !== value) {
              return 'La localidad no fue seleccionada del listado'
            }
            return ''
          }
        ]
      })
      // no lo pude hacer andar
      // new TagsInputView({
      //   name: 'id_localidad2',
      //   label: 'Localidad 2',
      //   // placeholder: 'Comience a escribir',
      //   required: true,
      //   requiredMessage: 'Debe seleccionar una localidad',
      //   // value: this.model.id_localidad,
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
  }
})
