<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model {
    use HasFactory;

    protected $table = 'publicacion';
    protected $primaryKey = 'publicacionid';
    public $timestamps = false;

    protected $fillable = [
        'fecha',
        'hora',
        'estado',
        'productoid'
    ];

    // Relación: Una publicación pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Product::class, 'productoid', 'productoid');
    }
}