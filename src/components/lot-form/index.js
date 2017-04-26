import AmpersandView from 'ampersand-view'
import LotForm from './lot-form'
import L from 'leaflet'
import ReportView from 'components/report'
import bootbox from 'components/bootbox'

export default AmpersandView.extend({
  template: `
    <div data-hook="lot-form" class="clearfix">
      <div data-hook="form-container" class="col-md-6"></div>
      <div data-hook="side-info" class="col-md-6">
        <dl>
          <dt>Superficie</dt>
          <dd><var data-hook="superficie">lotname</var> has</dd>
          <dt>Per&iacute;metro</dt>
          <dd><var data-hook="perimetro">lotname</var> m</dd>
        </dl>
        <button data-hook="report" class="btn btn-success btn-lg btn-block">Ver resumen</button>
      </div>
    </div>`,
  events: {
    'click [data-hook="report"]': function (event) {
      const report = new ReportView()
      report.render()
      bootbox.confirm({
        title: 'Reporte',
        message: report.el,
        buttons: {
          cancel: {
            label: 'Cerrar'
          },
          confirm: {
            label: 'Presupuestar',
            className: 'btn-success'
          }
        },
        callback: ask => {
          console.log('ask for a presupuesto senior:', ask)
        }
      })
    }
  },
  props: {
    layer: [ 'object', true ]
  },
  bindings: {
    area: {
      hook: 'superficie'
    },
    perimeter: {
      hook: 'perimetro'
    }
  },
  derived: {
    area: {
      deps: ['this.layer'],
      fn: function () {
        const area = L.GeometryUtil.geodesicArea(
            this.layer.getLatLngs().reduce((acc, cur) => Array.prototype.concat(acc, cur))
          ) / 10000 // to has.
        return area.toFixed(2)
      }
    },
    perimeter: {
      deps: ['this.layer'],
      fn: function () {
        const points = this.layer.getLatLngs().reduce((acc, cur) => Array.prototype.concat(acc, cur))
        if (points.length < 3) {
          throw new Error('this is not a polygon')
        }
        let totalDistance = 0
        for (var ii = 0; ii < points.length - 1; ii++) {
          totalDistance += L.latLng(points[ii]).distanceTo(L.latLng(points[ii + 1]))
        }
        return totalDistance.toFixed(2)
      }
    }
  },
  subviews: {
    form: {
      hook: 'form-container',
      prepareView: function (el) {
        this.formView = new LotForm({
          layer: this.layer
        })
        return this.formView
      }
    }
  }
})
