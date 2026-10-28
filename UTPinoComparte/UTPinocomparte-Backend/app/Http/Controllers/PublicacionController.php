<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PublicacionController {
    public function store(Request $request) {
        $request->validate([
            'nom_prod' => 'required|string|max:150',
            'precio' => 'required|numeric',
            'stock' => 'required|integer',
            'cat_prodid' => 'required|integer',
        ]);

        $rutaImagen = null;
        if ($request->hasFile('img_prod')) {
            $rutaImagen = $request->file('img_prod')->store('publicaciones', 'public');
        }

        try {
            DB::beginTransaction();

            // Usamos Product en lugar de Producto
            $producto = Product::create([
                'nom_prod' => $request->nom_prod,
                'img_prod' => $rutaImagen,
                'precio' => $request->precio,
                'stock' => $request->stock,
                'estado' => 'Disponible',
                'cat_prodid' => $request->cat_prodid
            ]);

            $publicacion = Publication::create([
                'fecha' => Carbon::now()->toDateString(),
                'hora' => Carbon::now()->toTimeString(),
                'estado' => 'Activo',
                'productoid' => $producto->productoid
            ]);

            DB::commit();

            return response()->json([
                'message' => '¡Producto y publicación creados con éxito!',
                'publicacion' => $publicacion->load('producto')
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Ocurrió un error al registrar',
                'detalle' => $e->getMessage()
            ], 500);
        } 
    }
public function misPublicaciones(Request $request)
{
    $user = $request->user();

    $publicaciones = Publication::with('producto')
                    ->where('usuarioid', $user->usuarioid ?? $user->id)
                    ->get();

    return response()->json($publicaciones, 200);
}
}