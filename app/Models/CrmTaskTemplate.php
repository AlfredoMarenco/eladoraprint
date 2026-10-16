<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmTaskTemplate extends Model
{
    protected $table = 'crm_task_templates';

    protected $fillable = [
        'universe',
        'name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(CrmTaskTemplateItem::class, 'template_id')->orderBy('order_index');
    }
}
