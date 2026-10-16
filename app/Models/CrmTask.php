<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmTask extends Model
{
    protected $table = 'crm_tasks';

    protected $fillable = [
        'order_id',
        'title',
        'description',
        'category',
        'assigned_to',
        'start_date',
        'due_date',
        'completed_at',
        'status',
        'blocked_reason',
        'depends_on_task_id',
        'priority',
        'order_index',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'due_date' => 'date',
        'completed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'order_id');
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function dependsOnTask(): BelongsTo
    {
        return $this->belongsTo(CrmTask::class, 'depends_on_task_id');
    }

    public function dependentTasks(): HasMany
    {
        return $this->hasMany(CrmTask::class, 'depends_on_task_id');
    }
}
