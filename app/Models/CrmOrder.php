<?php

namespace App\Models;

use App\Services\CrmFinancialService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class CrmOrder extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'crm_orders';

    protected $fillable = [
        'folio',
        'client_id',
        'quotation_id',
        'universe',
        'project_name',
        'service_type',
        'description',
        'requested_at',
        'start_planned_at',
        'start_real_at',
        'delivery_agreed_at',
        'next_milestone_at',
        'internal_deadline_at',
        'delivered_at',
        'closed_at',
        'commercial_status',
        'operating_status',
        'blocked_reason',
        'priority',
        'assigned_to',
        'approved_amount',
        'advance_required',
        'workshop_overhead_type',
        'workshop_overhead_amount',
        'notes',
    ];

    protected $casts = [
        'requested_at' => 'date',
        'start_planned_at' => 'date',
        'start_real_at' => 'date',
        'delivery_agreed_at' => 'date',
        'next_milestone_at' => 'date',
        'internal_deadline_at' => 'date',
        'delivered_at' => 'date',
        'closed_at' => 'date',
        'approved_amount' => 'decimal:2',
        'advance_required' => 'decimal:2',
        'workshop_overhead_amount' => 'decimal:2',
    ];

    protected $appends = [
        'total_collected',
        'balance_due',
        'pending_advance',
        'estimated_costs',
        'real_costs',
        'estimated_profit',
        'real_profit',
        'estimated_margin_percent',
        'financial_status',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class);
    }

    public function assignedUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(CrmTask::class, 'order_id')->orderBy('order_index');
    }

    public function approvals(): HasMany
    {
        return $this->hasMany(CrmOrderApproval::class, 'order_id')->latest();
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(CrmPurchase::class, 'order_id')->latest();
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CrmCustomerPayment::class, 'order_id')->latest();
    }

    public function costItems(): HasMany
    {
        return $this->hasMany(CrmOrderCostItem::class, 'order_id');
    }

    public function adjustments(): HasMany
    {
        return $this->hasMany(CrmFinancialAdjustment::class, 'order_id');
    }

    public function activityLogs(): MorphMany
    {
        return $this->morphMany(CrmActivityLog::class, 'subject')->latest();
    }

    // Financial Accessors delegating to CrmFinancialService
    public function getTotalCollectedAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateTotalCollected($this);
    }

    public function getBalanceDueAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateBalanceDue($this);
    }

    public function getPendingAdvanceAttribute(): float
    {
        return app(CrmFinancialService::class)->calculatePendingAdvance($this);
    }

    public function getEstimatedCostsAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateEstimatedCosts($this);
    }

    public function getRealCostsAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateRealCosts($this);
    }

    public function getEstimatedProfitAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateEstimatedProfit($this);
    }

    public function getRealProfitAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateRealProfit($this);
    }

    public function getEstimatedMarginPercentAttribute(): float
    {
        return app(CrmFinancialService::class)->calculateEstimatedMarginPercent($this);
    }

    public function getFinancialStatusAttribute(): string
    {
        return app(CrmFinancialService::class)->determineFinancialStatus($this);
    }
}
