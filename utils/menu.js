import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function mostrarMenu() {
    console.log(chalk.magenta('\n✨ ¡Bienvenido al Sistema de Don Edgar! ✨'));
    console.log(chalk.gray('============================================\n'));
    
    const { opcion } = await inquirer.prompt([
        {
            type: 'list',
            name: 'opcion',
            message: chalk.blue('Selecciona una opción:'),
            choices: [
                { name: chalk.green('➕ Agregar tarea'), value: '1' },
                { name: chalk.blue('📋 Listar tareas'), value: '2' },
                { name: chalk.yellow('✏️ Editar tarea'), value: '3' },
                { name: chalk.red('🗑️ Eliminar tarea'), value: '4' },
                { name: chalk.magenta('✅ Marcar como completada'), value: '5' },
                { name: chalk.cyan('🔍 Buscar tareas'), value: '6' },
                { name: chalk.gray('🚪 Salir'), value: '7' },
                new inquirer.Separator()
            ]
        }
    ]);
    return opcion;
}