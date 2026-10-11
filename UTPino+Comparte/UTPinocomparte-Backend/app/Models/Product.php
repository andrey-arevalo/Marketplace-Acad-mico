<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'producto';
    protected $primaryKey = 'productoid';
    
    public function categoria() {
        return $this->belongsTo(CategoryProd::class, 'cat_prodid', 'cat_prodid');
    }
}
