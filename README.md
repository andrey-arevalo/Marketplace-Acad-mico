# 🛒 UTPINO Comparte - Plataforma Universitaria de Intercambio

Plataforma web desarrollada para la comunidad de la UTP que permite a estudiantes y docentes comprar, vender e intercambiar artículos de forma segura sin intermediarios.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu equipo:

*   **Node.js**: `v18.x` o superior ([Descargar Node.js](https://nodejs.org/))
*   **npm**: `v9.x` o superior (incluido automáticamente con Node.js)
*   **Angular CLI**: `v16.x` o superior (`npm install -g @angular/cli`)
*   **Git**: ([Descargar Git](https://git-scm.com/))
*   **Backend / API**: Asegúrate de tener corriendo la API backend (Spring Boot / Laravel) si el proyecto consume endpoints externos.

---

## 🛠️ Pasos para Clonar y Ejecutar el Proyecto

Sigue estos pasos en tu terminal para poner a funcionar el proyecto localmente:

### 1. Clonar el Repositorio
Abre tu terminal (Git Bash, Command Prompt o Terminal de VS Code) y ejecuta:

git clone https://github.com/andrey-arevalo/Marketplace-Acad-mico.git

2. Ingresar a la Carpeta del Proyecto
Bash
cd utpino-comparte
3. Instalar las Dependencias
Ejecuta el siguiente comando para descargar todos los paquetes de Node y Bootstrap necesarios:

Bash
npm install
💡 Nota: Si encuentras algún conflicto de dependencias durante la instalación, puedes forzar la resolución ejecutando:
npm install --legacy-peer-deps

4. Configurar las Variables de Entorno (Opcional)
Si tu backend se ejecuta en un puerto diferente al predeterminado, revisa o crea el archivo src/environments/environment.ts con la URL de la API:

TypeScript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api' // Ajusta según la URL de tu Backend
};
5. Iniciar el Servidor de Desarrollo
Una vez instaladas las dependencias, inicia la aplicación Angular:

Bash
ng serve -o
La bandera -o abrirá automáticamente tu navegador predeterminado en http://localhost:4200/.
