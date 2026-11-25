<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        // $request->user() obtiene automáticamente al usuario autenticado por el token
        $usuarioId = $request->user()->usuarioid;

        // Busca el perfil de ese usuario trayendo también los datos de la tabla usuario
        $perfil = Profile::with('usuario')->where('usuarioid', $usuarioId)->first();

        return response()->json($perfil);
    }

    public function perfilPublico(int $id): JsonResponse
    {
        // Seleccionamos explícitamente solo los datos públicos del usuario
        $usuario = Usuario::query()
            ->select(['usuarioid', 'nom_us', 'foto'])
            ->where('usuarioid', $id)
            ->first();

        if (!$usuario) {
            return response()->json([
                'message' => 'Usuario no encontrado.'
            ], 404);
        }

        // Obtenemos las publicaciones del usuario junto con los datos del producto
        // Ajusta los nombres de columnas/relación según tus modelos exactos
        $publicaciones = Publicacion::query()
            ->with(['producto'])
            ->where('usuarioid', $id)
            ->orderByDesc('publicacionid')
            ->get();

        return response()->json([
            'usuario' => [
                'usuarioid' => $usuario->usuarioid,
                'nom_us'    => $usuario->nom_us,
                'foto'      => $usuario->foto,
            ],
            'publicaciones' => $publicaciones,
        ]);
    }
}