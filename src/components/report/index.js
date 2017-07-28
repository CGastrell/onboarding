import App from 'ampersand-app'
import AmpersandView from 'ampersand-view'
import React from 'react'
import ReactDOM from 'react-dom'
import bootbox from 'bootbox'
import $ from 'jquery'
import 'bootstrap/js/tooltip'
import UserActions from 'actions/user'

import './custom.css'

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
let leState = {}

export default AmpersandView.extend({
  template: `<div>
    <h3>Detalles</h3>
    <p>Seleccione los productos deseados para sus lotes</p>
    <div data-hook="lots"></div>
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group">
          <label for="correo">Correo electrónico</label>
          <input type="email" class="form-control" id="correo"
            placeholder="Email">
        </div>
      </div>
      <div class="col-sm-6">
        <div class="form-group">
          <label for="fullname">Nombre y apellido</label>
          <input type="text" class="form-control" id="fullname"
            placeholder="Nombre y apellido">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <div class="form-group">
          <label for="tel">Código de área y teléfono</label>
          <input type="text" class="form-control" id="tel"
            placeholder="02254 48 3939">
        </div>
      </div>
      <div class="col-sm-6">
        Ingrese los datos de contacto y solicite su presupuesto.
        Nos contactaremos con ud. a la brevedad.
      </div>
    </div>

  </div>`,
  render: function () {
    this.renderWithTemplate(this)

    this.requestReport = this.requestReport.bind(this)
    this.confirmModal = bootbox.confirm({
      title: 'Solicitud de presupuesto',
      message: this.el,
      size: 'large',
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

    ReactDOM.render(
      <ReportRequest />,
      this.queryByHook('lots')
    )
  },
  requestReport: function (confirm) {
    if (!confirm) {
      App.Map.rightSidebar.show()
      return
    }
    const email = this.query('#correo').value
    const nombre = this.query('#fullname').value
    const tel = this.query('#tel').value
    // validate email
    if (!emailRegex.test(email)) {
      bootbox.alert('Debe ingresar un email válido', () => {})
      // returning false prevents bootbox close
      return false
    }
    // validate some name
    if (!nombre) {
      bootbox.alert('Por favor, ingrese su nombre', () => {})
      // returning false prevents bootbox close
      return false
    }
    // validate tel
    if (!tel) {
      bootbox.alert('Por favor, ingrese su teléfono', () => {})
      // returning false prevents bootbox close
      return false
    }
    leState.fullname = nombre
    leState.telefono = tel
    leState.email = email
    App.progress.start()
    UserActions.requestBudget(leState)
  }
})

class ReportRequest extends React.Component {
  constructor (props) {
    super(props)
    const geojson = App.state.featureCollection.toGeoJSON()
    this.state = geojson
    leState = geojson
    this.handleProductToggle = this.handleProductToggle.bind(this)
  }

  handleProductToggle (product, lot) {
    const features = this.state.features.map(feature => {
      if (feature.id === lot) {
        feature.properties[product] = !feature.properties[product]
      }
      return feature
    })
    this.setState({features: features})
    leState = JSON.parse(JSON.stringify(this.state))
  }

  render () {
    return (
      <div>
        <LotTable
          collection={this.state.features}
          onProductToggle={this.handleProductToggle}
        />
      </div>
    )
  }
}

const LotTable = (props) => {
  const { collection, onProductToggle } = props
  return (
    <table className='table table-striped table-hover'>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Establecimiento</th>
          <th>Área</th>
          <th>Cultivos</th>
          <th>Productos</th>
        </tr>
      </thead>
      <tbody>
        {
          collection.map((feature, idx) => {
            return <LotRow
              key={feature.id}
              id={feature.id}
              properties={feature.properties}
              onProductToggle={onProductToggle}
            />
          })
        }
      </tbody>
    </table>
  )
}

class LotRow extends React.Component {
  // componentDidMount () {
  //   $('[data-toggle="tooltip"]').tooltip()
  // }

  render () {
    const { id, properties, onProductToggle } = this.props
    const { nombre, settlement, cultivos } = properties
    const area = (Number(properties.area) / 100 << 0) / 100
    const productos = [
      { code: 'axa', nombre: 'Ambientacion' },
      { code: 'mol', nombre: 'Monitoreo OnLine' },
      { code: 'cosecha', nombre: 'Cosecha' },
      { code: 'prescripcion', nombre: 'Prescripcion' }
    ]
    const Cultivo = (cultivo, idx) => (
      idx === 0
      ? <span>{App.state.cultivos.get(cultivo).nombre}</span>
      : <span>, {App.state.cultivos.get(cultivo).nombre}</span>
    )

    return (
      <tr className='lot-row'>
        <td className='nombre'>{nombre}</td>
        <td className='settlment'>{settlement}</td>
        <td className='area'>{area} has.</td>
        <td className='cultivos'>{cultivos.map(Cultivo)}</td>
        <td className='productos'>{
          productos.map((producto, idx) => {
            const active = properties[producto.code] ? 'btn-primary' : 'btn-default'
            return (
              <a
                href='toggleProduct'
                key={producto.code}
                role='button'
                className={`btn ${active} btn-xs`}
                data-toggle='tooltip'
                data-placement='top'
                title='Haga click para activar el producto'
                onClick={
                  event => {
                    event.preventDefault()
                    onProductToggle(producto.code, id)
                  }
                }>{producto.nombre}
              </a>
            )
          })
        }</td>
      </tr>
    )
  }
}
