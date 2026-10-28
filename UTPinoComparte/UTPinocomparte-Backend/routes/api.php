<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PublicacionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/publicaciones', [PublicacionController::class, 'index']);// Ruta pública para que cualquiera vea los productos en el feed

// Ruta protegida que exige el token de sesión
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/publicaciones', [PublicacionController::class, 'store']);
});

Route::middleware('auth:sanctum')->get('/mis-publicaciones', [PublicacionController::class, 'misPublicaciones']);