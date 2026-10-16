<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    use HasFactory;

    protected $fillable = ['client_name', 'company', 'content', 'avatar_image', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
