<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $table = 'conversacion';
    protected $primaryKey = 'conversacionid';
    public $timestamps = false; // Manejado por la columna fech_creacion en MySQL

    protected $fillable = [
        'tipo',
        'nombre',
        'fech_creacion'
    ];

    // Relación con Mensajes
    public function mensajes()
    {
        return $this->hasMany(Message::class, 'conversacionid', 'conversacionid');
    }
}
