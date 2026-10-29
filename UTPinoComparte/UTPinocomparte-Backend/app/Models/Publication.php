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
        'productoid',
        'usuarioid',
    ];

    // Relación: Una publicación pertenece a un producto
    public function producto()
    {
        return $this->belongsTo(Product::class, 'productoid', 'productoid');
    }

    // Relación: Una publicación pertenece a un usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuarioid', 'usuarioid');
    }
}