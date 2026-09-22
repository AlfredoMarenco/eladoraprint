<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    
    protected $guarded = [];

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}
