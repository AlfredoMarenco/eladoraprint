<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CrmSimulationCostItem extends Model
{
    protected $table = 'crm_simulation_cost_items';

    protected $fillable = [
        'scenario_id',
        'category',
        'concept',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function scenario(): BelongsTo
    {
        return $this->belongsTo(CrmSimulationScenario::class, 'scenario_id');
    }
}
