<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'business_name',
        'phone',
        'whatsapp',
        'email',
        'client_type',
        'channel',
        'first_contact_at',
        'internal_notes',
        'status',
    ];

    protected $casts = [
        'first_contact_at' => 'date',
    ];

    public function opportunities(): HasMany
    {
        return $this->hasMany(Opportunity::class);
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(CrmOrder::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CrmCustomerPayment::class);
    }

    /**
     * Compute total balance due across all client orders.
     */
    public function getTotalBalanceDueAttribute(): float
    {
        return $this->orders->sum(fn (CrmOrder $order) => $order->balance_due);
    }

    /**
     * Total paid by client across all orders.
     */
    public function getTotalPaidAttribute(): float
    {
        return (float) $this->payments()->where('is_reversal', false)->sum('amount');
    }
}
