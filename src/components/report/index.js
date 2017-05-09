import App from 'ampersand-app'
import AmpersandView from 'ampersand-view'
import React from 'react'
import ReactDOM from 'react-dom'

import './custom.css'

export default AmpersandView.extend({
  template: `<div>
    <h3>Detalles</h3>
    <div data-hook="lots"></div>
  </div>`,
  initialize: function (options) {
    this.lotSearchFn = options.lotSearchFn
  },
  render: function () {
    this.renderWithTemplate(this)

    ReactDOM.render(
      <LotTable
        collection={App.state.featureCollection.features}
        onSearchClick={this.lotSearchFn}
      />,
      this.queryByHook('lots')
    )
  }
})

class LotTable extends React.Component {
  componentWillMount () {
    this.setState({features: App.state.featureCollection.features})
  }

  render () {
    const searchFn = this.props.onSearchClick
    const { features } = this.state
    return (
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Establecimiento</th>
            <th>Área</th>
            <th>Cultivo</th>
            <th>Productos</th>
            <th style={{textAlign: 'center'}}><span className='glyphicon glyphicon-eye-open' /></th>
          </tr>
        </thead>
        <tbody>
          {
            features.map((feature, idx) => {
              return <LotRow key={idx} {...feature} onSearchClick={searchFn} />
            })
          }
        </tbody>
      </table>
    )
  }
}

class LotRow extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (event) {
    event.preventDefault()
    this.props.onSearchClick(this.props)
  }

  render () {
    const { properties } = this.props
    const { nombre, settlement } = properties
    const area = (Number(properties.area) / 100 << 0) / 100
    const crop = App.state.tipoCultivos.get(properties.id_tipo_cultivo) || ''
    const productos = [
      { nombre: 'Ambientacion', enabled: properties.axa },
      { nombre: 'Monitoreo OnLine', enabled: properties.mol },
      { nombre: 'Cosecha', enabled: properties.cosecha },
      { nombre: 'Prescripcion', enabled: properties.prescripcion }
    ]
    return (
      <tr className='lot-row'>
        <td className='nombre'>{nombre}</td>
        <td className='settlment'>{settlement}</td>
        <td className='area'>{area} has.</td>
        <td className='crop'>{crop.nombre || ''}</td>
        <td className='productos'>{
          productos.map((producto, idx) => {
            return (
              producto.enabled
              ? <div key={idx}>{producto.nombre}</div>
              : ''
            )
          })
        }</td>
        <td className='actions'>
          <a href='#' role='button' onClick={this.handleClick}>
            <span className='glyphicon glyphicon-search' />
          </a>
        </td>
      </tr>
    )
  }
}
