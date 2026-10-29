<?php
namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Publication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class PublicacionController {
    public function store(Request $request)
    {
        $user = $request->user(); // 1. Obtenemos el usuario autenticado

        $request->validate([
            'nom_prod' => 'required|string|max:150',
            'desc_prod' => 'nullable|string|max:300',
            'precio' => 'nullable|numeric|max:1000',
            'stock' => 'required|integer|min:1',
            'cat_prodid' => 'required|integer',
            'estado' => 'required|string', // 'Disponible' o 'Intercambio'
            'motivo_intercambio' => 'nullable|string|max:250',
        ]);

        $rutaImagen = null;
        if ($request->hasFile('img_prod')) {
            $rutaImagen = $request->file('img_prod')->store('publicaciones', 'public');
        }

        try {
            DB::beginTransaction();

            // 2. Creamos el producto con todos los campos nuevos
            $producto = Product::create([
                'nom_prod' => $request->nom_prod,
                'descripcion' => $request->desc_prod,
                'img_prod' => $rutaImagen,
                'precio' => $request->estado === 'Disponible' ? $request->precio : 0,
                'stock' => $request->stock,
                'estado' => $request->estado,
                'cat_prodid' => $request->cat_prodid,
                'motivo_intercambio' => $request->estado === 'Intercambio' ? $request->motivo_intercambio : null
            ]);

            // 3. Creamos la publicación amarrada al usuario
            $publicacion = Publication::create([
                'fecha' => Carbon::now()->toDateString(),
                'hora' => Carbon::now()->toTimeString(),
                'estado' => 'Activo',
                'productoid' => $producto->productoid,
                'usuarioid' => $user->usuarioid 
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
    try {
        $user = $request->user();

        if (!$user) {
            return response()->json(['error' => 'No autorizado'], 401);
        }

        // Filtramos las publicaciones del usuario autenticado de forma segura
        $publicaciones = Publication::with('producto')
                        ->where('usuarioid', $user->usuarioid)
                        ->orderBy('publicacionid', 'desc')
                        ->get();

        return response()->json($publicaciones, 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al obtener publicaciones',
            'detalle' => $e->getMessage()
        ], 500);
    }
}
 public function destroy(Request $request, $id)
    {
        $user = $request->user();

        try {
            DB::beginTransaction();

            // 1. Buscamos la publicación asegurándonos de que pertenezca al usuario logueado
            $publicacion = Publication::where('publicacionid', $id)
                            ->where('usuarioid', $user->usuarioid)
                            ->first();

            if (!$publicacion) {
                return response()->json([
                    'detalle' => 'Publicación no encontrada o no tienes permisos para eliminarla.'
                ], 404);
            }

            // Guardamos el ID del producto antes de borrar la publicación
            $productoId = $publicacion->productoid;

            // Opcional: Eliminar la imagen física del servidor si existe
            if ($publicacion->producto && $publicacion->producto->img_prod) {
                Storage::disk('public')->delete($publicacion->producto->img_prod);
            }

            // 2. BORRAMOS PRIMERO LA PUBLICACIÓN (Rompe la dependencia de la llave foránea)
            $publicacion->delete();

            // 3. LUEGO BORRAMOS EL PRODUCTO ASOCIADO
            if ($productoId) {
                Product::where('productoid', $productoId)->delete();
            }

            DB::commit();

            return response()->json([
                'message' => 'Publicación y producto eliminados correctamente.'
            ], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'detalle' => 'Error al eliminar la publicación: ' . $e->getMessage()
            ], 500);
        }
    }
}