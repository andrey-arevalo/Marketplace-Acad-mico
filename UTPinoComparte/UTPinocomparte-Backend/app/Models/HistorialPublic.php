<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistorialPublic extends Model
{
    protected $table = 'historial_public';
    protected $primaryKey = 'historialid';
    public $timestamp = false;

    protected $fillable = 
        [
            'publicacionid'
        ];

    public function publicacion()
    {
       return $this -> belongsTo(
          Publicacion::class,
          'publicacionid',
          'publicacionid'
       );
    }
    
}
