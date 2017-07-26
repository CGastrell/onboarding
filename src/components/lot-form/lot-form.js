import App from 'ampersand-app'
import FormView from 'ampersand-form-view'
import InputView from 'components/input-view'
// import TypeaheadView from 'components/input-view/typeahead'
import CustomSelectView from './select-with-buttons-view'
// import SelectView from 'components/select-view'
// import CheckboxView from 'components/checkbox-view'
import Select2View from 'components/select2-view'

// import TagsInputView from 'components/input-view/tagsinput'
// import 'styles/bootstrap-tagsinput.css'

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
      // new SelectView({
      //   name: 'id_tipo_cultivo',
      //   label: 'Cultivo',
      //   value: this.datamodel.id_cultivo,
      //   styles: 'form-group',
      //   required: true,
      //   requiredMessage: 'Necesita especificar un cultivo',
      //   invalidClass: 'text-danger',
      //   options: App.state.tipoCultivos,
      //   yieldModel: false,
      //   idAttribute: 'id_tipo_cultivo',
      //   textAttribute: 'nombre',
      //   validityClassSelector: '.control-label'
      // }),
      // this.idLocalidadInputView,
      // TODO: after selecting a loc, if you type and re-select,
      // the label will remain as if it wasn't valid
      // new TypeaheadView({
      //   name: 'localidad',
      //   label: 'Localidad',
      //   value: this.datamodel.localidad,
      //   styles: 'form-group',
      //   placeholder: 'Escriba el nombre de una localidad',
      //   required: true,
      //   requiredMessage: 'Debe seleccionar una localidad de la lista',
      //   invalidClass: 'text-danger',
      //   options: App.localidades,
      //   idAttribute: 'id_localidad',
      //   textAttribute: 'localidad',
      //   validityClassSelector: '.control-label',
      //   afterSelect: (item) => {
      //     // set the hidden input value to the id of the loc match
      //     this.idLocalidadInputView.setValue(item.id_localidad)
      //   },
      //   tests: [
      //     value => {
      //       if (!this.idLocalidadInputView.value) {
      //         return 'Debe seleccionar una localidad'
      //       }
      //       const casted = Number(this.idLocalidadInputView.value)
      //       const definedLoc = App.localidades.find(loc => loc.id_localidad === casted)
      //       if (!definedLoc || definedLoc.localidad !== value) {
      //         return 'La localidad no fue seleccionada del listado'
      //       }
      //       return ''
      //     }
      //   ]
      // }),
      // new CheckboxView({
      //   name: 'axa',
      //   label: 'Ambientación',
      //   value: this.datamodel.axa
      // }),
      // new CheckboxView({
      //   name: 'mol',
      //   label: 'Monitoreo Online',
      //   value: this.datamodel.mol
      // }),
      // new CheckboxView({
      //   name: 'cosecha',
      //   label: 'Mapa de Rinde',
      //   value: this.datamodel.cosecha
      // }),
      // new CheckboxView({
      //   name: 'prescripcion',
      //   label: 'Prescripción',
      //   value: this.datamodel.prescripcion
      // })

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
      //     source: App.localidades.toJSON()
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
