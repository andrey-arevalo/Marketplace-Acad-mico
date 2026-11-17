<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class AuthController
{
    // PASO 1: Valida los datos y envía el código OTP al correo UTP
    public function enviarCodigoRegistro(Request $request)
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
        ]);

        // Generar código aleatorio de 6 dígitos
        $codigo = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Guardamos temporalmente los datos del formulario en caché por 10 minutos
        $datosRegistro = [
            'cod_est' => strtoupper($request->cod_est),
            'nom_us' => $request->nom_us,
            'correo' => $request->correo,
            'contrasena' => Hash::make($request->contrasena),
        ];

        Cache::put('otp_data_' . $request->correo, $datosRegistro, now()->addMinutes(10));
        Cache::put('otp_code_' . $request->correo, $codigo, now()->addMinutes(10));

        // Enviar el correo electrónico institucional
        Mail::raw(
            "Hola {$request->nom_us},\n\nTu código de verificación para UTPINO Comparte es: {$codigo}\n\nEste código expira en 10 minutos.",
            function ($message) use ($request) {
                $message->to($request->correo)
                        ->subject('Código de verificación - UTPINO Comparte');
            }
        );

        // CORREGIDO: Se cambió response.json por response()->json
        return response()->json([
            'message' => 'Código de verificación enviado a tu correo institucional.'
        ], 200);
    }

    // PASO 2: Recibe el código OTP y la foto, valida y crea el usuario final
    public function verificarYRegistrar(Request $request)
    {
        $request->validate([
            'correo' => 'required|email',
            'codigo' => 'required|string|size:6',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $codigoGuardado = Cache::get('otp_code_' . $request->correo);
        $datosRegistro = Cache::get('otp_data_' . $request->correo);

        if (!$codigoGuardado || !$datosRegistro || $codigoGuardado !== $request->codigo) {
            return response()->json([
                'message' => 'El código de verificación es incorrecto o ya expiró.'
            ], 422);
        }

        // Manejo de la foto de perfil
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('fotos_perfil', 'public');
        }

        // Crear el usuario definitivo en la base de datos
        $user = User::create([
            'cod_est'    => $datosRegistro['cod_est'],
            'nom_us'     => $datosRegistro['nom_us'],
            'correo'     => $datosRegistro['correo'],
            'contrasena' => $datosRegistro['contrasena'], 
            'foto'       => $fotoPath,
        ]);

        // Limpiar la caché
        Cache::forget('otp_code_' . $request->correo);
        Cache::forget('otp_data_' . $request->correo);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Usuario registrado y verificado con éxito',
            'user'    => $user,
            'token'   => $token
        ], 201);
    }

    // Método de login
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