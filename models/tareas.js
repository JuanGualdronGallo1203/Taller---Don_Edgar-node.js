export class Tarea {
    constructor(descripcion, id = null) {
        // Si no se proporciona un ID, se asignará luego en el controller
        this.id = id;
        this.descripcion = descripcion.trim();
        this.completada = false;
        this.fechaCreacion = new Date().toISOString();
        this.fechaModificacion = new Date().toISOString();
    }
}