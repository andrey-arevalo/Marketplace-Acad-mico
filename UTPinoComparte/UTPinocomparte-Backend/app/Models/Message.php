<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $table = 'mensaje';
    protected $primaryKey = 'mensajeid';
    public $timestamps = false;

    protected $fillable = [
        'conversacionid',
        'participanteid',
        'txt_msj',
        'fech_envio',
        'estado'
    ];

    // Relación con Conversación
    public function conversacion()
    {
        return $this->belongsTo(Conversation::class, 'conversacionid', 'conversacionid');
    }

    // Relación con Participante
    public function participante()
    {
        return $this->belongsTo(Participant::class, 'participanteid', 'participanteid');
    }
}
