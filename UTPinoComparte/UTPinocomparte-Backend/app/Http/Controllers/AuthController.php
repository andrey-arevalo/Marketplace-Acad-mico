<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController
{
    public function register(Request $request)
    {
        $request->validate([
            'cod_est' => 'required|string|regex:/^U\d+$/i|max:20',
            'nom_us' => 'required|string|max:100',
            'correo' => [
                'required',
                'string',
                'email',
                'max:150',
                'unique:usuario,correo',
                function ($attribute, $value, $fail) use ($request) {
                    $expectedEmail = strtolower($request->cod_est) . '@utp.edu.pe';
                    if (strtolower($value) !== $expectedEmail) {
                        $fail('El correo institucional debe coincidir con tu código de estudiante (Ej: U24204554@utp.edu.pe).');
                    }
                },
            ],
            'contrasena' => 'required|string|min:6',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Valida que sea una imagen de hasta 2MB
        ]);

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            // Guarda la foto en storage/app/public/fotos_perfil
            $fotoPath = $request->file('foto')->store('fotos_perfil', 'public');
        }

        $user = User::create([
            'cod_est' => strtoupper($request->cod_est),
            'nom_us' => $request->nom_us,
            'correo' => $request->correo,
            'contrasena' => $request->contrasena,
            'foto' => $fotoPath,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado con éxito',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'correo' => [
                'required',
                'string',
                'email',
                'regex:/@utp\.edu\.pe$/'
            ],
            'contrasena' => 'required|string',
        ]);

        $user = User::where('correo', $request->correo)->first();

        if (! $user || ! Hash::check($request->contrasena, $user->contrasena)) {
            throw ValidationException::withMessages([
                'correo' => ['Las credenciales son incorrectas.'],
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login exitoso',
            'user' => $user,
            'token' => $token
        ]);
    }
}