<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class CrmActivityLog extends Model
{
    protected $table = 'crm_activity_logs';

    protected $fillable = [
        'subject_type',
        'subject_id',
        'user_id',
        'action',
        'description',
        'properties',
    ];

    protected $casts = [
        'properties' => 'array',
    ];

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(Model $subject, string $action, string $description, ?array $properties = null, ?int $userId = null): static
    {
        return static::create([
            'subject_type' => get_class($subject),
            'subject_id' => $subject->getKey(),
            'user_id' => $userId ?? auth()->id(),
            'action' => $action,
            'description' => $description,
            'properties' => $properties,
        ]);
    }
}
