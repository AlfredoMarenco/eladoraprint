<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmOrderCostItem extends Model
{
    use HasFactory;

    protected $table = 'crm_order_cost_items';

    protected $fillable = [
        'order_id',
        'category',
        'concept',
        'estimated_amount',
        'real_amount',
        'notes',
    ];

    protected $casts = [
        'estimated_amount' => 'decimal:2',
        'real_amount' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'order_id');
    }

    public function getEffectiveCostAttribute(): float
    {
        return (float) ($this->real_amount ?? $this->estimated_amount);
    }
}
