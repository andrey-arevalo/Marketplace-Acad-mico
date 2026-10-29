<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'producto';
    protected $primaryKey = 'productoid';
    public $timestamps = false;

    protected $fillable = [
        'nom_prod',
        'precio',
        'cat_prodid',
        'desc_prod',
        'stock',
        'img_prod',
        'estado',
        'motivo_intercambio'
    ];

    // Relación con Publicacion
    public function publicaciones()
    {
        return $this->hasMany(Publication::class, 'productoid', 'productoid');
    }
}