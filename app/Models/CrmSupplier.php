<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmSupplier extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'crm_suppliers';

    protected $fillable = [
        'name',
        'contact_name',
        'phone',
        'email',
        'category',
        'notes',
        'status',
    ];

    public function purchases(): HasMany
    {
        return $this->hasMany(CrmPurchase::class, 'supplier_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CrmSupplierPayment::class, 'supplier_id');
    }

    public function getTotalPurchasedAttribute(): float
    {
        return (float) $this->purchases()
            ->where('purchase_status', '!=', 'cancelled')
            ->sum(\DB::raw('COALESCE(real_amount, estimated_amount)'));
    }

    public function getTotalPaidAttribute(): float
    {
        return (float) $this->payments()->sum('amount');
    }

    public function getPendingBalanceAttribute(): float
    {
        return max(0, $this->total_purchased - $this->total_paid);
    }
}
