<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soporte extends Model
{
    use HasFactory;

    // Indicamos explícitamente el nombre de la tabla
    protected $table = 'soportes';

    // Indicamos que tu llave primaria se llama soporteid (y no 'id')
    protected $primaryKey = 'soporteid';

    // Campos permitidos para la inserción masiva
    protected $fillable = [
        'usuarioid',
        'tipoProblema',
        'nombre',
        'correo',
        'telefono',
        'transaccion',
        'desc_report',
        'archivo_path'
    ];
}