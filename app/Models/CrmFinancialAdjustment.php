<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmFinancialAdjustment extends Model
{
    protected $table = 'crm_financial_adjustments';

    protected $fillable = [
        'order_id',
        'type',
        'amount',
        'reason',
        'registered_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'order_id');
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }
}
