<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Soporte;
use Illuminate\Support\Facades\Storage;

class SoporteController extends Controller
{
    public function store(Request $request)
    {
        // Validamos que los campos obligatorios lleguen correctamente
        $validated = $request->validate([
            'tipoProblema' => 'required|string',
            'nombre' => 'required|string|max:100',
            'correo' => 'required|email|max:150',
            'telefono' => 'nullable|string|max:20',
            'transaccion' => 'nullable|string|max:100',
            'desc_report' => 'required|string|min:10|max:1000',
            'archivo' => 'nullable|file|max:5120' // Máximo 5MB tal como validamos en Angular
        ]);

        $filePath = null;

        // Si el usuario adjuntó un archivo, lo guardamos de forma segura en el storage
        if ($request->hasFile('archivo')) {
            $filePath = $request->file('archivo')->store('soportes_evidencias', 'public');
        }

        // Creamos el registro en la base de datos usando Eloquent ORM
        $soporte = Soporte::create([
            'usuarioid' => $request->input('usuarioid'), // Opcional si está logueado
            'tipoProblema' => $validated['tipoProblema'],
            'nombre' => $validated['nombre'],
            'correo' => $validated['correo'],
            'telefono' => $request->input('telefono'),
            'transaccion' => $request->input('transaccion'),
            'desc_report' => $validated['desc_report'],
            'archivo_path' => $filePath
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Reporte de soporte registrado con éxito',
            'data' => $soporte
        ], 201);
    }
}