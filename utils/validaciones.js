import inquirer from 'inquirer';
import pkg from 'lodash';
const { isEmpty, trim } = pkg;

export function validarNoVacio(input) {
    if (isEmpty(trim(input))) {
        return '❌ Este campo no puede estar vacío. ¡Don Edgar no lo permitiría!';
    }
    return true;
}

export async function confirmarAccion(mensaje) {
    const { confirmacion } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmacion',
            message: mensaje,
            default: false
        }
    ]);
    return confirmacion;
}