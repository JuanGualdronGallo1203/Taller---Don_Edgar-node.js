import pkg from 'lodash';
const { uniqueId } = pkg;

export class Tarea {
constructor(descripcion) {
    this.id = uniqueId('tarea_');
    this.descripcion = descripcion.trim();
    this.completada = false;
    this.fechaCreacion = new Date().toISOString();
    this.fechaModificacion = new Date().toISOString();
}
}