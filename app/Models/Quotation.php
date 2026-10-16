<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Quotation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'folio',
        'client_id',
        'opportunity_id',
        'universe',
        'project_name',
        'description',
        'items',
        'subtotal',
        'discount',
        'total_amount',
        'advance_required',
        'payment_terms',
        'estimated_delivery_time',
        'creation_date',
        'sent_date',
        'expiration_date',
        'accepted_date',
        'status',
        'notes',
        'version',
        'converted_to_order_id',
        'converted_at',
    ];

    protected $casts = [
        'items' => 'array',
        'subtotal' => 'decimal:2',
        'discount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'advance_required' => 'decimal:2',
        'creation_date' => 'date',
        'sent_date' => 'date',
        'expiration_date' => 'date',
        'accepted_date' => 'date',
        'converted_at' => 'datetime',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function opportunity(): BelongsTo
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function convertedOrder(): BelongsTo
    {
        return $this->belongsTo(CrmOrder::class, 'converted_to_order_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(QuotationVersion::class)->orderByDesc('version_number');
    }

    public function activityLogs(): MorphMany
    {
        return $this->morphMany(CrmActivityLog::class, 'subject');
    }

    /**
     * Create an immutable snapshot of this quotation.
     */
    public function createSnapshot(?int $userId = null, ?string $reason = null): QuotationVersion
    {
        return $this->versions()->create([
            'version_number' => $this->version,
            'snapshot_data' => $this->toArray(),
            'created_by' => $userId,
            'reason' => $reason ?? 'Versión registrada del presupuesto',
        ]);
    }
}
