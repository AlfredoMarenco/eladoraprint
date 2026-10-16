<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmOrderApproval extends Model
{
    protected $table = 'crm_order_approvals';

    protected $fillable = [
        'order_id',
        'version_title',
        'review_type',
        'sent_at',
        'deadline_at',
        'file_path',
        'file_name',
        'external_url',
        'client_feedback',
        'status',
        'responded_at',
        'approved_by_name',
        'evidence_notes',
        'created_by',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'deadline_at' => 'datetime',
        'responded_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'order_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
