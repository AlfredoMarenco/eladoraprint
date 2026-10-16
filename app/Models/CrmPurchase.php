<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmPurchase extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'crm_purchases';

    protected $fillable = [
        'folio',
        'supplier_id',
        'order_id',
        'concept',
        'category',
        'estimated_amount',
        'real_amount',
        'requested_date',
        'expected_delivery_date',
        'real_delivery_date',
        'payment_due_date',
        'purchase_status',
        'receipt_notes',
        'receipt_file_path',
    ];

    protected $casts = [
        'estimated_amount' => 'decimal:2',
        'real_amount' => 'decimal:2',
        'requested_date' => 'date',
        'expected_delivery_date' => 'date',
        'real_delivery_date' => 'date',
        'payment_due_date' => 'date',
    ];

    protected $appends = [
        'paid_amount',
        'pending_payment_amount',
        'payment_status',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(CrmSupplier::class, 'supplier_id');
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'order_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CrmSupplierPayment::class, 'purchase_id');
    }

    public function getEffectiveCostAttribute(): float
    {
        return (float) ($this->real_amount ?? $this->estimated_amount);
    }

    public function getPaidAmountAttribute(): float
    {
        return (float) $this->payments()->sum('amount');
    }

    public function getPendingPaymentAmountAttribute(): float
    {
        return max(0, $this->effective_cost - $this->paid_amount);
    }

    public function getPaymentStatusAttribute(): string
    {
        if ($this->paid_amount <= 0) {
            return 'pending';
        }
        if ($this->paid_amount >= $this->effective_cost) {
            return 'paid';
        }

        return 'partial';
    }
}
