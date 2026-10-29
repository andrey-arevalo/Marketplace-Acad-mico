<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'usuario'; 
    protected $primaryKey = 'usuarioid'; 
    
    public $timestamps = false; 

    protected $fillable = [
        'cod_est',
        'nom_us',
        'correo',
        'contrasena',
        'estado',
        'ultim_acces',
        'foto',
    ];

    protected $hidden = [
        'contrasena',
    ];

    protected function casts(): array
    {
        return [
            'contrasena' => 'hashed',
        ];
    }
    
    public function getAuthPassword()
    {
        return $this->contrasena;
    }
    
    // Relación: Un usuario tiene muchas publicaciones
    public function publicaciones()
    {
        return $this->hasMany(Publication::class, 'usuarioid', 'usuarioid');
    }
}