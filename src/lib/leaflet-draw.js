import L from 'leaflet'
import 'leaflet-draw'

// DRAW
L.drawLocal.draw.toolbar.buttons.polygon = 'Nuevo lote'

L.drawLocal.draw.toolbar.actions = {
  title: 'Cancelar nuevo lote',
  text: 'Cancelar'
}

L.drawLocal.draw.toolbar.finish = {
  title: 'Cierra el polígono y crea el nuevo lote',
  text: 'Finalizar'
}

L.drawLocal.draw.toolbar.undo = {
  title: 'Remover último punto agregado',
  text: 'Deshacer'
}

L.drawLocal.draw.handlers.polygon.tooltip = {
  cont: 'Clikee para seguir agregando puntos',
  end: 'Clickee nuevamente sobre el primer punto para crear el lote',
  start: 'Clickee para marcar el primer punto'
}

// EDIT
L.drawLocal.edit.toolbar.buttons = {
  edit: 'Editar lote',
  editDisabled: 'No hay lotes para editar',
  remove: 'Borrar lote',
  removeDisabled: 'No hay lotes para borrar'
}
L.drawLocal.edit.handlers.edit.tooltip = {
  subtext: 'Arrastre puntos de control para editar',
  text: 'Click para remover punto de control'
}
L.drawLocal.edit.toolbar.actions.save = {
  title: 'Guardar cambios',
  text: 'Guardar'
}
L.drawLocal.edit.toolbar.actions.cancel = {
  title: 'Cancelar para deshacer los cambios',
  text: 'Cancelar'
}
L.drawLocal.edit.handlers.remove.tooltip = {
  text: 'Clickee sobre un lote para borrarlo'
}

L.Edit.Poly = L.Edit.Poly.extend({
  options: {
    icon: new L.DivIcon({
      iconSize: new L.Point(12, 12),
      className: 'leaflet-div-icon leaflet-editing-icon vertex'
    })
  }
})

export const drawingStyles = {
  polygon: {
    icon: new L.DivIcon({
      iconSize: new L.Point(12, 12),
      className: 'leaflet-div-icon leaflet-editing-icon vertex'
    })
  }
}

export const controlOptions = {
  position: 'topright',
  edit: {
    featureGroup: null,
    poly: {
      allowIntersection: false
    }
    // remove: false
  },
  draw: {
    marker: false,
    polyline: false,
    rectangle: false,
    circle: false,
    polygon: {
      allowIntersection: false,
      showArea: true
    }
  }
}

// L.DrawToolbar.extend({
//   getModeHandlers: function (map) {
//     return [
//       {
//         enabled: this.options.polygon,
//         handler: new L.Draw.Polygon(map, this.options.polygon),
//         title: L.drawLocal.draw.toolbar.buttons.polygon
//       }
//     ]
//   }
// })
