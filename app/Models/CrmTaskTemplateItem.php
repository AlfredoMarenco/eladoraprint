<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmTaskTemplateItem extends Model
{
    protected $table = 'crm_task_template_items';

    protected $fillable = [
        'template_id',
        'title',
        'description',
        'category',
        'order_index',
        'days_offset',
        'is_optional',
    ];

    protected $casts = [
        'is_optional' => 'boolean',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(CrmTaskTemplate::class, 'template_id');
    }
}
