<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('soportes', function (Blueprint $table) {
            $table->id('soporteid');
            $table->unsignedBigInteger('usuarioid')->nullable(); // Relación con el usuario logueado
            $table->string('tipoProblema');
            $table->string('nombre');
            $table->string('correo');
            $table->string('telefono')->nullable();
            $table->string('transaccion')->nullable();
            $table->text('desc_report');
            $table->string('archivo_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('soportes');
    }
};