<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Opportunity extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'folio',
        'client_id',
        'universe',
        'title',
        'description',
        'contact_channel',
        'entry_date',
        'last_contact_date',
        'next_followup_date',
        'assigned_to',
        'priority',
        'estimated_amount',
        'stage',
        'lost_reason',
        'notes',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'last_contact_date' => 'date',
        'next_followup_date' => 'date',
        'estimated_amount' => 'decimal:2',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function quotations(): HasMany
    {
        return $this->hasMany(Quotation::class);
    }

    public function activityLogs(): MorphMany
    {
        return $this->morphMany(CrmActivityLog::class, 'subject');
    }
}
