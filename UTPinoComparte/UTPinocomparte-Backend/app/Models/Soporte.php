<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Soporte extends Model
{
    use HasFactory;

    protected $table = 'soportes';
    protected $primaryKey = 'soporteid';

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