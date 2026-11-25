<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicacionController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\SoporteController;
use App\Http\Controllers\ChatController;

Route::post('/auth/enviar-codigo', [AuthController::class, 'enviarCodigoRegistro']);
Route::post('/auth/verificar-registro', [AuthController::class, 'verificarYRegistrar']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/publicaciones', [PublicacionController::class, 'index']); // Ruta pública para que cualquiera vea los productos en el feed

Route::get('/usuario/{id}/perfil-publico', [PerfilController::class, 'perfilPublico']);

// Rutas protegidas que exigen el token de sesión
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/publicaciones', [PublicacionController::class, 'store']);
    Route::get('/mis-publicaciones', [PublicacionController::class, 'misPublicaciones']);
    Route::delete('/publicaciones/{id}', [PublicacionController::class, 'destroy']);

    // --- RUTAS DE CHAT PROTEGIDAS ---
    Route::get('/conversaciones', [ChatController::class, 'misConversaciones']);
    Route::get('/conversaciones/{id}/mensajes', [ChatController::class, 'verMensajes']);
    Route::post('/mensajes', [ChatController::class, 'enviarMensaje']);
});

// Ruta para registrar los reportes de soporte desde Angular
Route::post('/soporte', [SoporteController::class, 'store']);