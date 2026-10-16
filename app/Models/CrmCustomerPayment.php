<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmCustomerPayment extends Model
{
    use HasFactory;

    protected $table = 'crm_customer_payments';

    protected $fillable = [
        'folio',
        'order_id',
        'client_id',
        'payment_date',
        'amount',
        'concept',
        'payment_method',
        'reference',
        'receipt_file_path',
        'notes',
        'registered_by',
        'is_reversal',
        'reversed_payment_id',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
        'is_reversal' => 'boolean',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'order_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class, 'client_id');
    }

    public function registeredByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    public function reversedPayment(): BelongsTo
    {
        return $this->belongsTo(CrmCustomerPayment::class, 'reversed_payment_id');
    }
}
