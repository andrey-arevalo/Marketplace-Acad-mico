<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $table = 'participante';
    protected $primaryKey = 'participanteid';
    public $timestamps = false;

    protected $fillable = [
        'fech_union',
        'ultim_lectura',
        'usuarioid'
    ];

    // Relación con Usuario
    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuarioid', 'usuarioid');
    }

    // Relación con Mensajes enviados
    public function mensajes()
    {
        return $this->hasMany(Message::class, 'participanteid', 'participanteid');
    }
}
