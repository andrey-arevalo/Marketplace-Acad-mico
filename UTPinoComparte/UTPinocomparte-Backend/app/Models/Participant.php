<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participant extends Model
{
    protected $table = 'participante';
    protected $primaryKey = 'participanteid';
    public $timestamps = false;

    protected $fillable = [
        'conversacionid',
        'fech_union',
        'ultim_lectura',
        'usuarioid'
    ];

    protected $casts = [
        'fech_union' => 'datetime',
        'ultim_lectura' => 'datetime',
    ];

    // Relación con Conversación
    public function conversacion()
    {
        return $this->belongsTo(Conversation::class, 'conversacionid', 'conversacionid');
    }

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
