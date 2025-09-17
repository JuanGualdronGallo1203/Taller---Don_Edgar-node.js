import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ARCHIVO_TAREAS = path.join(__dirname, '..', 'data', 'tareas.json');

export async function leerTareas() {
    try {
        await fs.access(ARCHIVO_TAREAS);
        const datos = await fs.readFile(ARCHIVO_TAREAS, 'utf-8');
        return JSON.parse(datos);
    } catch (error) {
        // Si el archivo no existe, devolver array vacío
        return [];
    }
}

export async function guardarTareas(tareas) {
    try {
        // Asegurarse de que el directorio existe
        await fs.mkdir(path.dirname(ARCHIVO_TAREAS), { recursive: true });
        await fs.writeFile(ARCHIVO_TAREAS, JSON.stringify(tareas, null, 2));
    } catch (error) {
        console.error('Error al guardar las tareas:', error);
        throw error;
    }
}