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
    
    // Generar ID incremental
    let nuevoId = 1;
    if (tareas.length > 0) {
      // Encontrar el máximo ID numérico actual
      const idsNumericos = tareas.map(t => {
        const idNum = parseInt(t.id.replace('tarea_', ''));
        return isNaN(idNum) ? 0 : idNum;
      });
      nuevoId = Math.max(...idsNumericos) + 1;
    }
    
    const nuevaTarea = new Tarea(descripcion, `tarea_${nuevoId}`);
    
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

    // Mostrar opciones de filtrado como lista numerada
    console.log(chalk.blue('\n¿Cómo quieres ver las tareas?'));
    console.log(chalk.white('1) Todas las tareas'));
    console.log(chalk.white('2) Solo tareas completadas'));
    console.log(chalk.white('3) Solo tareas pendientes'));
    console.log('');

    const { tipoListado } = await inquirer.prompt([
      {
        type: 'input',
        name: 'tipoListado',
        message: 'Selecciona una opción (1-3):',
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > 3) {
            return 'Por favor ingresa un número entre 1 y 3';
          }
          return true;
        },
        filter: (input) => {
          const num = parseInt(input);
          return num === 1 ? 'todas' : (num === 2 ? 'completadas' : 'pendientes');
        }
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


    console.log(chalk.blue('\nSelecciona una tarea para editar:'));
    console.log(chalk.gray('================================'));
    
    tareas.forEach((tarea, index) => {
      const estado = tarea.completada ? chalk.green('✅ Completada') : chalk.red('❌ Pendiente');
      console.log(chalk.white(`${index + 1}. [${estado}] ${tarea.descripcion}`));
    });
    console.log('');

    const { indice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'indice',
        message: `Ingresa el número de la tarea (1-${tareas.length}):`,
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > tareas.length) {
            return `Por favor ingresa un número entre 1 y ${tareas.length}`;
          }
          return true;
        },
        filter: (input) => {
          return parseInt(input) - 1; // Convertir a índice base 0
        }
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

    // Mostrar lista numerada
    console.log(chalk.blue('\nSelecciona una tarea para eliminar:'));
    console.log(chalk.gray('=================================='));
    
    tareas.forEach((tarea, index) => {
      const estado = tarea.completada ? chalk.green('✅ Completada') : chalk.red('❌ Pendiente');
      console.log(chalk.white(`${index + 1}. [${estado}] ${tarea.descripcion}`));
    });
    console.log('');

    const { indice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'indice',
        message: `Ingresa el número de la tarea (1-${tareas.length}):`,
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > tareas.length) {
            return `Por favor ingresa un número entre 1 y ${tareas.length}`;
          }
          return true;
        },
        filter: (input) => {
          return parseInt(input) - 1;
        }
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

    // Mostrar lista numerada solo de tareas pendientes
    console.log(chalk.blue('\nSelecciona una tarea para marcar como completada:'));
    console.log(chalk.gray('=================================================='));
    
    tareasPendientes.forEach((tarea, index) => {
      console.log(chalk.white(`${index + 1}. ${tarea.descripcion}`));
    });
    console.log('');

    const { indice } = await inquirer.prompt([
      {
        type: 'input',
        name: 'indice',
        message: `Ingresa el número de la tarea (1-${tareasPendientes.length}):`,
        validate: (input) => {
          const num = parseInt(input);
          if (isNaN(num) || num < 1 || num > tareasPendientes.length) {
            return `Por favor ingresa un número entre 1 y ${tareasPendientes.length}`;
          }
          return true;
        },
        filter: (input) => {
          const indexPendiente = parseInt(input) - 1;
          // Encontrar el índice real en el array completo
          return tareas.indexOf(tareasPendientes[indexPendiente]);
        }
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