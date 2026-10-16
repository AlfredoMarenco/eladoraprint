<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmSupplierPayment extends Model
{
    use HasFactory;

    protected $table = 'crm_supplier_payments';

    protected $fillable = [
        'folio',
        'purchase_id',
        'supplier_id',
        'payment_date',
        'amount',
        'payment_method',
        'reference',
        'receipt_file_path',
        'notes',
        'registered_by',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function purchase(): BelongsTo
    {
        return $this->belongsTo(CrmPurchase::class, 'purchase_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(CrmSupplier::class, 'supplier_id');
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }
}
