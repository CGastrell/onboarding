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
