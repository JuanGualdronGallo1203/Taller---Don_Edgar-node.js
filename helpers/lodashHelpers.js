import pkg from 'lodash';
const { orderBy, 
  uniqBy, 
  groupBy, 
  filter, 
  includes, 
  toLower  } = pkg;

// Ordenar tareas por campo y dirección
export function ordenarTareas(tareas, campo = 'fechaCreacion', direccion = 'desc') {
  return orderBy(tareas, [campo], [direccion]);
}

// Eliminar tareas duplicadas por descripción
export function eliminarDuplicados(tareas) {
  return uniqBy(tareas, 'descripcion');
}

// Agrupar tareas por estado (completadas/pendientes)
export function agruparPorEstado(tareas) {
  return groupBy(tareas, t => t.completada ? 'completadas' : 'pendientes');
}

// Filtrar tareas por palabra clave en la descripción
export function filtrarPorPalabra(tareas, palabra) {
  return filter(tareas, t => includes(toLower(t.descripcion), toLower(palabra)));
}