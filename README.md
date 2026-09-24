CAMBIO DEL 24/09/2026 01:53 A.M.
📋 Estado Actual del Backend y Base de Datos (Para el Grupo)
Hemos finalizado con éxito la integración del sistema de autenticación de la aplicación utilizando Angular, PHP (PDO), XAMPP y MySQL.

1. Estructura de la Base de Datos (utpino_comparte)
La tabla principal encargada de gestionar a los usuarios se llama usuario y cuenta con la siguiente estructura:

usuarioid: INT (Clave primaria, autoincremental).

nom_us: VARCHAR(100) (Nombre del usuario).

correo: VARCHAR(150) (Correo institucional, único).

contrasena: VARCHAR(255) (Almacena la contraseña del usuario en texto plano para facilitar las pruebas actuales).

fech_registro: TIMESTAMP (Fecha y hora automática de registro).

estado: VARCHAR(20) (Por defecto 'activo').

ultim_acces: DATETIME (Registro del último inicio de sesión).

2. Endpoints y Lógica del Backend (PHP en XAMPP)
Los archivos se encuentran en la ruta del servidor local (htdocs/utpino-backend/) y devuelven respuestas estrictamente en formato JSON con cabeceras CORS configuradas para comunicarse con Angular:

registro.php (Método POST):

Recibe un objeto JSON con: { nombre, correo, password }.

Valida que los campos no estén vacíos y que el correo no esté duplicado en la base de datos.

Inserta los datos mapeados en las columnas nom_us, correo y contrasena.

login.php (Método POST):

Recibe un objeto JSON con: { correo, password }.

Busca al usuario por su correo electrónico en la base de datos.

Realiza una validación directa en texto plano (===) contra la columna contrasena.

Devuelve una respuesta con success: true/false, un mensaje descriptivo y el nombre del usuario (nom_us) si el inicio de sesión es exitoso.
