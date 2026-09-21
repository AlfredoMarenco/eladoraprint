<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;
    protected $fillable = [
        'category_id', 'title', 'slug', 'description', 'client', 'role',
        'project_url', 'video_url', 'completion_date', 'is_published', 'cover_image'
    ];

    protected $casts = [
        'completion_date' => 'date',
        'is_published' => 'boolean',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProjectImage::class)->orderBy('order');
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }
}
