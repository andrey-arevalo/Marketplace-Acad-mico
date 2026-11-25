# 🛒 UTPINO Comparte - Plataforma Universitaria de Intercambio

Plataforma web desarrollada para la comunidad de la UTP que permite a estudiantes y docentes comprar, vender e intercambiar artículos de forma segura sin intermediarios.

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado el siguiente software en tu equipo:

*   **Node.js**: `v20.19+`, `v22.12+` o `v24+` ([Descargar Node.js](https://nodejs.org/))
*   **npm**: incluido con Node.js
*   **Git**: ([Descargar Git](https://git-scm.com/))
*   **Backend Laravel**: PHP `8.3+` y Composer

---

## 🛠️ Pasos para Clonar y Ejecutar el Proyecto

Sigue estos pasos en tu terminal para poner a funcionar el proyecto localmente:

### 1. Clonar el Repositorio
Abre tu terminal (Git Bash, Command Prompt o Terminal de VS Code) y ejecuta:

git clone https://github.com/andrey-arevalo/Marketplace-Acad-mico.git

### Ejecutar el frontend

Desde la carpeta raíz del repositorio, instala las dependencias del frontend usando el lockfile:

```powershell
cd .\UTPinoComparte\UTPinocomparte-Frontend
npm ci
```

Luego inicia Angular (no hace falta instalar Angular CLI globalmente):

```powershell
npm start
```

Abre http://localhost:4200/ en el navegador. En un clon nuevo es necesario ejecutar `npm ci` una vez porque `node_modules` no se incluye en Git.

## Inicializar el backend Laravel

En un clon nuevo, la carpeta `vendor` no existe porque contiene dependencias instaladas localmente y no se incluye en Git. Instálalas antes de ejecutar Artisan:

```powershell
cd .\UTPinoComparte\UTPinocomparte-Backend
composer install
```

Si no tienes Composer instalado globalmente, puedes usar el archivo incluido en el backend:

```powershell
php .\composer.phar install
```

Luego crea la configuración local y genera la clave de Laravel:

```powershell
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
php artisan key:generate
```

Configura en `.env` la conexión a tu base de datos antes de migrar y arrancar la API:

```powershell
php artisan migrate
php artisan serve
```
