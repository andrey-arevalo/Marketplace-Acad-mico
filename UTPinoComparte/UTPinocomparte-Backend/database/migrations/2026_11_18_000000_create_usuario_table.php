<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('usuario', function (Blueprint $table) {
            $table->id('usuarioid');
            $table->string('cod_est', 20)->unique();
            $table->string('nom_us', 100);
            $table->string('correo', 150)->unique();
            $table->string('contrasena');
            $table->timestamp('fech_registro')->useCurrent();
            $table->string('estado', 20)->default('activo');
            $table->dateTime('ultim_acces')->nullable();
            $table->string('foto')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('usuario');
    }
};
