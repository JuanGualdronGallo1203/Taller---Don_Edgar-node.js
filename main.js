import mostrarMenu from './utils/menu.js';
import { 
  agregarTarea, 
  listarTareas, 
  editarTarea, 
  eliminarTarea, 
  marcarCompletada,
  buscarTareas 
} from './controllers/tareasController.js';
import chalk from 'chalk';

async function main() {
  console.log(chalk.magenta('📋 Sistema de Gestión de Tareas de Don Edgar'));
  console.log(chalk.gray('============================================\n'));
  
  let salir = false;

  while (!salir) {
    try {
      const opcion = await mostrarMenu();

      switch (opcion) {
        case '1':
          await agregarTarea();
          break;
        case '2':
          await listarTareas();
          break;
        case '3':
          await editarTarea();
          break;
        case '4':
          await eliminarTarea();
          break;
        case '5':
          await marcarCompletada();
          break;
        case '6':
          await buscarTareas();
          break;
        case '7':
          salir = true;
          console.log(chalk.green('👋 ¡Hasta pronto! Que Don Edgar esté contento con nuestro trabajo.'));
          break;
      }
    } catch (error) {
      console.error(chalk.red('❌ Error inesperado:'), error.message);
    }
    
    if (!salir) {
      console.log('\n');
    }
  }
}

main().catch(error => {
  console.error(chalk.red('❌ Error crítico:'), error.message);
  process.exit(1);
});