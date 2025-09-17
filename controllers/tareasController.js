import inquirer from 'inquirer';
import chalk from 'chalk';
import { Tarea } from '../models/tareas.js';
import { 
  leerTareas, 
  guardarTareas 
} from '../utils/archivo.js';
import {
  validarNoVacio,
  confirmarAccion
} from '../utils/validaciones.js';
import {
  ordenarTareas,
  agruparPorEstado,
  filtrarPorPalabra,
  eliminarDuplicados
} from '../helpers/lodashHelpers.js';

export async function agregarTarea() {
  try {
    const { descripcion } = await inquirer.prompt([
      { 
        type: 'input', 
        name: 'descripcion', 
        message: 'Descripción de la tarea:',
        validate: validarNoVacio
      }
    ]);

    const tareas = await leerTareas();
    const nuevaTarea = new Tarea(descripcion);
    
    tareas.push(nuevaTarea);
    const tareasSinDuplicados = eliminarDuplicados(tareas);
    
    await guardarTareas(tareasSinDuplicados);
    console.log(chalk.green('✅ Tarea agregada correctamente.'));
  } catch (error) {
    console.error(chalk.red('❌ Error al agregar tarea:'), error.message);
  }
}

export async function listarTareas() {
  try {
    const tareas = await leerTareas();
    
    if (tareas.length === 0) {
      console.log(chalk.yellow('📭 No hay tareas registradas.'));
      return;
    }

    const { tipoListado } = await inquirer.prompt([
      {
        type: 'list',
        name: 'tipoListado',
        message: '¿Cómo quieres ver las tareas?',
        choices: [
          { name: 'Todas', value: 'todas' },
          { name: 'Completadas', value: 'completadas' },
          { name: 'Pendientes', value: 'pendientes' }
        ]
      }
    ]);

    let tareasFiltradas = tareas;
    
    if (tipoListado === 'completadas') {
      tareasFiltradas = tareas.filter(t => t.completada);
    } else if (tipoListado === 'pendientes') {
      tareasFiltradas = tareas.filter(t => !t.completada);
    }

    if (tareasFiltradas.length === 0) {
      const mensaje = tipoListado === 'completadas' 
        ? 'No hay tareas completadas.' 
        : 'No hay tareas pendientes.';
      console.log(chalk.yellow(`📭 ${mensaje}`));
      return;
    }

    const tareasOrdenadas = ordenarTareas(tareasFiltradas, 'fechaCreacion', 'desc');
    
    console.log(chalk.blue('\n📋 Lista de tareas:'));
    console.log('====================');
    
    tareasOrdenadas.forEach((tarea, index) => {
      const estado = tarea.completada ? chalk.green('✅ Completada') : chalk.red('❌ Pendiente');
      const numero = chalk.blue(`${index + 1}.`);
      console.log(`${numero} [${estado}] ${tarea.descripcion}`);
      console.log(chalk.gray(`   Creada: ${new Date(tarea.fechaCreacion).toLocaleDateString()}`));
      console.log(chalk.gray(`   Modificada: ${new Date(tarea.fechaModificacion).toLocaleDateString()}\n`));
    });

    const agrupadas = agruparPorEstado(tareas);
    console.log(chalk.blue(`Resumen: ${agrupadas.completadas?.length || 0} completadas, ${agrupadas.pendientes?.length || 0} pendientes`));
  } catch (error) {
    console.error(chalk.red('❌ Error al listar tareas:'), error.message);
  }
}

export async function editarTarea() {
  try {
    const tareas = await leerTareas();
    
    if (tareas.length === 0) {
      console.log(chalk.yellow('⚠️ No hay tareas para editar.'));
      return;
    }

    const tareasPendientes = tareas.filter(t => !t.completada);
    const tareasCompletadas = tareas.filter(t => t.completada);
    
    const { indice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'indice',
        message: 'Selecciona una tarea para editar:',
        choices: [
          ...(tareasPendientes.length > 0 ? [new inquirer.Separator('=== PENDIENTES ===')] : []),
          ...tareasPendientes.map((t, i) => ({
            name: `${t.descripcion} ${chalk.red('(Pendiente)')}`,
            value: tareas.indexOf(t)
          })),
          ...(tareasCompletadas.length > 0 ? [new inquirer.Separator('=== COMPLETADAS ===')] : []),
          ...tareasCompletadas.map((t, i) => ({
            name: `${t.descripcion} ${chalk.green('(Completada)')}`,
            value: tareas.indexOf(t)
          }))
        ]
      }
    ]);

    const { nuevaDescripcion } = await inquirer.prompt([
      { 
        type: 'input', 
        name: 'nuevaDescripcion', 
        message: 'Nueva descripción:',
        default: tareas[indice].descripcion,
        validate: validarNoVacio
      }
    ]);

    tareas[indice].descripcion = nuevaDescripcion.trim();
    tareas[indice].fechaModificacion = new Date().toISOString();
    
    await guardarTareas(tareas);
    console.log(chalk.green('✏️ Tarea actualizada correctamente.'));
  } catch (error) {
    console.error(chalk.red('❌ Error al editar tarea:'), error.message);
  }
}

export async function eliminarTarea() {
  try {
    const tareas = await leerTareas();
    
    if (tareas.length === 0) {
      console.log(chalk.yellow('⚠️ No hay tareas para eliminar.'));
      return;
    }

    const { indice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'indice',
        message: 'Selecciona una tarea para eliminar:',
        choices: tareas.map((t, i) => ({
          name: `${t.descripcion} ${t.completada ? chalk.green('(Completada)') : chalk.red('(Pendiente)')}`,
          value: i
        }))
      }
    ]);

    const confirmacion = await confirmarAccion('¿Estás seguro de que quieres eliminar esta tarea?');
    
    if (confirmacion) {
      tareas.splice(indice, 1);
      await guardarTareas(tareas);
      console.log(chalk.green('🗑️ Tarea eliminada correctamente.'));
    } else {
      console.log(chalk.blue('Operación cancelada.'));
    }
  } catch (error) {
    console.error(chalk.red('❌ Error al eliminar tarea:'), error.message);
  }
}

export async function marcarCompletada() {
  try {
    const tareas = await leerTareas();
    const tareasPendientes = tareas.filter(t => !t.completada);
    
    if (tareasPendientes.length === 0) {
      console.log(chalk.yellow('🎉 ¡No hay tareas pendientes!'));
      return;
    }

    const { indice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'indice',
        message: 'Selecciona una tarea para marcar como completada:',
        choices: tareasPendientes.map((t, i) => ({
          name: t.descripcion,
          value: tareas.indexOf(t)
        }))
      }
    ]);

    tareas[indice].completada = true;
    tareas[indice].fechaModificacion = new Date().toISOString();
    
    await guardarTareas(tareas);
    console.log(chalk.green('✅ Tarea marcada como completada.'));
  } catch (error) {
    console.error(chalk.red('❌ Error al marcar tarea como completada:'), error.message);
  }
}

export async function buscarTareas() {
  try {
    const tareas = await leerTareas();
    
    if (tareas.length === 0) {
      console.log(chalk.yellow('📭 No hay tareas para buscar.'));
      return;
    }

    const { palabra } = await inquirer.prompt([
      { 
        type: 'input', 
        name: 'palabra', 
        message: 'Palabra clave para buscar:',
        validate: validarNoVacio
      }
    ]);

    const resultados = filtrarPorPalabra(tareas, palabra);
    
    if (resultados.length === 0) {
      console.log(chalk.yellow('🔍 No se encontraron tareas con esa palabra.'));
      return;
    }

    console.log(chalk.blue(`\n🔍 Resultados de búsqueda para "${palabra}":`));
    console.log('====================================');
    
    resultados.forEach((tarea, index) => {
      const estado = tarea.completada ? chalk.green('✅ Completada') : chalk.red('❌ Pendiente');
      const numero = chalk.blue(`${index + 1}.`);
      console.log(`${numero} [${estado}] ${tarea.descripcion}`);
    });
  } catch (error) {
    console.error(chalk.red('❌ Error al buscar tareas:'), error.message);
  }
}