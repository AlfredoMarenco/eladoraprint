<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmSimulationScenario extends Model
{
    use HasFactory;

    protected $table = 'crm_simulation_scenarios';

    protected $fillable = [
        'name',
        'universe',
        'service_type',
        'quantity',
        'proposed_sale_price',
        'workshop_overhead_amount',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'proposed_sale_price' => 'decimal:2',
        'workshop_overhead_amount' => 'decimal:2',
    ];

    protected $appends = [
        'total_costs',
        'estimated_profit',
        'estimated_margin_percent',
    ];

    public function costItems(): HasMany
    {
        return $this->hasMany(CrmSimulationCostItem::class, 'scenario_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function getTotalCostsAttribute(): float
    {
        $itemsSum = (float) $this->costItems()->sum('amount');

        return round($itemsSum + (float) $this->workshop_overhead_amount, 2);
    }

    public function getEstimatedProfitAttribute(): float
    {
        return round((float) $this->proposed_sale_price - $this->total_costs, 2);
    }

    public function getEstimatedMarginPercentAttribute(): float
    {
        $price = (float) $this->proposed_sale_price;
        if ($price <= 0) {
            return 0.0;
        }

        return round(($this->estimated_profit / $price) * 100, 2);
    }
}
