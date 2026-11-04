<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Soporte;
use Illuminate\Support\Facades\Mail;

class SoporteController
{
    public function store(Request $request)
    {
        // Validamos que los campos obligatorios vengan bien
        $validated = $request->validate([
            'tipoProblema' => 'required|string',
            'nombre' => 'required|string|max:100',
            'correo' => 'required|email|max:150',
            'telefono' => 'nullable|string|max:20',
            'transaccion' => 'nullable|string|max:100',
            'desc_report' => 'required|string|min:10|max:1000',
            'archivo' => 'nullable|file|max:5120' // Máximo 5MB
        ]);

        $filePath = null;

        // Si el usuario subió una evidencia, la guardamos en la carpeta pública
        if ($request->hasFile('archivo')) {
            $filePath = $request->file('archivo')->store('soportes_evidencias', 'public');
        }

        // Creamos el registro en la base de datos
        $soporte = Soporte::create([
            'usuarioid' => $request->input('usuarioid'),
            'tipoProblema' => $validated['tipoProblema'],
            'nombre' => $validated['nombre'],
            'correo' => $validated['correo'],
            'telefono' => $request->input('telefono'),
            'transaccion' => $request->input('transaccion'),
            'desc_report' => $validated['desc_report'],
            'archivo_path' => $filePath
        ]);

        // Simulamos el envío del correo (lo guardará en el log local por seguridad)
        try {
            $destinatario = "soporte@utpinocomparte.pe";

            Mail::send('emails.soporte_alerta', ['soporte' => $soporte], function ($message) use ($soporte, $destinatario, $filePath) {
                $message->to($destinatario)
                        ->subject("Nuevo reporte de soporte: {$soporte->tipoProblema} - {$soporte->nombre}");
                
                // Adjuntamos el archivo al correo si existe
                if ($filePath) {
                    $message->attach(storage_path('app/public/' . $filePath));
                }
            });
        } catch (\Exception $e) {
            \Log::error("No se pudo enviar el correo de soporte: " . $e->getMessage());
        }

        // Retornamos respuesta exitosa en JSON
        return response()->json([
            'success' => true,
            'message' => 'Reporte registrado correctamente',
            'data' => $soporte
        ], 201);
    }
}