import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function mostrarMenu() {
    console.log(chalk.magenta('\n✨ ¡Bienvenido al Sistema de Don Edgar! ✨'));
    console.log(chalk.gray('============================================\n'));
    
    // Mostrar opciones numeradas
    console.log(chalk.blue('Opciones disponibles:'));
    console.log(chalk.green('1) ➕ Agregar tarea'));
    console.log(chalk.blue('2) 📋 Listar tareas'));
    console.log(chalk.yellow('3) ✏️ Editar tarea'));
    console.log(chalk.red('4) 🗑️ Eliminar tarea'));
    console.log(chalk.magenta('5) ✅ Marcar como completada'));
    console.log(chalk.cyan('6) 🔍 Buscar tareas'));
    console.log(chalk.gray('7) 🚪 Salir'));
    console.log('');
    
    const { opcion } = await inquirer.prompt([
        {
            type: 'input',
            name: 'opcion',
            message: chalk.blue('Selecciona una opción (1-7):'),
            validate: (input) => {
                const num = parseInt(input);
                if (isNaN(num) || num < 1 || num > 7) {
                    return 'Por favor ingresa un número entre 1 y 7';
                }
                return true;
            },
            filter: (input) => {
                return parseInt(input).toString();
            }
        }
    ]);
    
    return opcion;
}