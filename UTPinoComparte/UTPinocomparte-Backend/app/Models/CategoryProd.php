<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryProd extends Model
{
    protected $table = 'categoria_prod';
    protected $primaryKey = 'cat_prodid';
    public $timestamps = false;

    protected $fillable = [
        'nom_cat'
    ];

    // Relación con Producto
    public function productos()
    {
        return $this->hasMany(Product::class, 'cat_prodid', 'cat_prodid');
    }
}

