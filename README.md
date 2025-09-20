📋 Gestor de Tareas CLI - Don Edgar Edition

Aplicación de consola desarrollada en Node.js, que permite gestionar un listado de tareas con opciones interactivas, colores y persistencia en archivo JSON.

Este proyecto está pensado para practicar conceptos de:

Modularización en Node.js.

Programación orientada a objetos (POO).

Manejo de archivos.

Interacción con el usuario mediante consola.

Uso de librerías externas como Inquirer, Chalk y Lodash.

🎯 Objetivo del Proyecto

El sistema busca brindar una forma simple pero completa de administrar tareas directamente desde la terminal.
Con esta herramienta puedes:

Registrar nuevas tareas.

Consultar, editar y eliminar tareas existentes.

Marcar tareas como completadas.

Filtrar y buscar de manera rápida.

🗂️ Estructura del Proyecto
├── controllers/
│   └── tareasController.js   # Lógica de negocio: CRUD de tareas
├── helpers/
│   └── lodashHelpers.js      # Funciones utilitarias (ordenar, agrupar, filtrar, etc.)
├── models/
│   └── tareas.js             # Definición de la clase Tarea
├── utils/
│   ├── archivo.js            # Lectura y escritura en JSON
│   └── validaciones.js       # Validaciones de entradas y confirmaciones
├── data/
│   └── tareas.json           # Archivo de almacenamiento de datos
├── menu.js                   # Menú interactivo con opciones numeradas
└── README.md                 # Documentación del proyecto

⚙️ Requisitos Previos

Node.js
 versión 16+

npm versión 7+

Sistema operativo con acceso a consola (Windows, Linux, macOS)

📦 Instalación

Clonar el repositorio:

git clone https://github.com/tu-usuario/gestor-tareas-don-edgar.git
cd gestor-tareas-don-edgar


Instalar dependencias:

npm install


Ejecutar la aplicación:

node menu.js

▶️ Uso del Programa

Al iniciar, verás el menú principal:

✨ ¡Bienvenido al Sistema de Don Edgar! ✨
============================================

Opciones disponibles:
1) ➕ Agregar tarea
2) 📋 Listar tareas
3) ✏️ Editar tarea
4) 🗑️ Eliminar tarea
5) ✅ Marcar como completada
6) 🔍 Buscar tareas
7) 🚪 Salir

Selecciona una opción (1-7):

Ejemplo de flujo:

Seleccionas 1 → Agregar tarea → Escribes: "Estudiar Node.js".

Seleccionas 2 → Listar tareas → Aparecerá como pendiente.

Seleccionas 5 → Marcar completada → La tarea cambiará a estado ✅.

📚 Funcionalidades Detalladas
➕ Agregar Tarea

Solicita una descripción no vacía.

Asigna un ID único incremental (tarea_1, tarea_2, ...).

Guarda en tareas.json.

📋 Listar Tareas

Opciones:

Todas

Solo completadas

Solo pendientes

Muestra fechas de creación y modificación.

Incluye un resumen con cantidad de tareas.

✏️ Editar Tarea

Permite seleccionar una tarea y actualizar su descripción.

Actualiza automáticamente la fecha de modificación.

🗑️ Eliminar Tarea

Selección de tarea por número.

Confirmación obligatoria antes de borrar.

✅ Marcar como Completada

Solo muestra tareas pendientes.

Cambia estado a true y actualiza fecha.

🔍 Buscar Tareas

Busca coincidencias en la descripción.

Insensible a mayúsculas/minúsculas.

🛠️ Tecnologías y Dependencias

Node.js
 → Entorno de ejecución.

Inquirer
 → Prompts interactivos.

Chalk
 → Colores en la consola.

Lodash
 → Funciones de utilidad (ordenar, filtrar, agrupar, etc.).

fs/promises → Manejo de archivos JSON.

Instalación de dependencias manual:

npm install inquirer chalk lodash

📊 Modelo de Datos

Cada tarea tiene la siguiente estructura:

{
  "id": "tarea_3",
  "descripcion": "Preparar la reunión de mañana",
  "completada": false,
  "fechaCreacion": "2025-09-19T20:00:00.000Z",
  "fechaModificacion": "2025-09-19T20:00:00.000Z"
}

🔑 Buenas Prácticas Aplicadas

Modularización: Código separado en controladores, modelos, helpers y utilidades.

Validaciones: Entradas obligatorias, confirmaciones para acciones críticas.

Persistencia confiable: Manejo seguro de archivos con creación automática de directorios.

Colores y feedback: Uso de chalk para mejorar la experiencia de usuario.

Evitar duplicados: Implementación de verificación con lodash.uniqBy().

🌱 Posibles Mejoras Futuras

Implementar subtareas o categorías.

Exportar reportes en CSV/Excel.

Integración con base de datos (ej: MongoDB o SQLite).

Añadir soporte multilenguaje (ES/EN).

Crear interfaz gráfica con Electron.js.

👨‍💻 Autores

- Cristian Perez
- Juan Sebastian Gualdron
