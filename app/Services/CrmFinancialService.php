<?php

namespace App\Services;

use App\Models\CrmOrder;
use App\Models\CrmPurchase;

class CrmFinancialService
{
    /**
     * Calculate total collected from client for an order.
     * Takes reversals into account.
     */
    public function calculateTotalCollected(CrmOrder $order): float
    {
        // Positive payments
        $positive = (float) $order->payments()
            ->where('is_reversal', false)
            ->sum('amount');

        // Reversals (already have positive amounts stored, so we subtract)
        $reversals = (float) $order->payments()
            ->where('is_reversal', true)
            ->sum('amount');

        return round(max(0, $positive - $reversals), 2);
    }

    /**
     * Calculate balance due from client.
     */
    public function calculateBalanceDue(CrmOrder $order): float
    {
        $approved = (float) $order->approved_amount;
        $collected = $this->calculateTotalCollected($order);

        // Adjustments that reduce balance (like discounts)
        $discountAdjustments = (float) $order->adjustments()
            ->where('type', 'discount')
            ->sum('amount');

        $balance = $approved - $collected - $discountAdjustments;

        return round(max(0, $balance), 2);
    }

    /**
     * Calculate pending advance required.
     */
    public function calculatePendingAdvance(CrmOrder $order): float
    {
        $advanceRequired = (float) $order->advance_required;
        if ($advanceRequired <= 0) {
            return 0.0;
        }

        $advanceCollected = (float) $order->payments()
            ->where('is_reversal', false)
            ->where('concept', 'anticipo')
            ->sum('amount');

        $advanceReversals = (float) $order->payments()
            ->where('is_reversal', true)
            ->where('concept', 'anticipo')
            ->sum('amount');

        $netAdvanceCollected = max(0, $advanceCollected - $advanceReversals);

        return round(max(0, $advanceRequired - $netAdvanceCollected), 2);
    }

    /**
     * Calculate estimated costs (purchases + cost items + workshop overhead).
     */
    public function calculateEstimatedCosts(CrmOrder $order): float
    {
        $purchases = (float) $order->purchases()
            ->where('purchase_status', '!=', 'cancelled')
            ->sum('estimated_amount');

        $costItems = (float) $order->costItems()
            ->sum('estimated_amount');

        $overhead = (float) $order->workshop_overhead_amount;

        return round($purchases + $costItems + $overhead, 2);
    }

    /**
     * Calculate real costs recorded.
     * For items where real_amount is set, use real_amount; otherwise fallback to estimated.
     */
    public function calculateRealCosts(CrmOrder $order): float
    {
        $purchases = (float) $order->purchases()
            ->where('purchase_status', '!=', 'cancelled')
            ->sum(\DB::raw('COALESCE(real_amount, estimated_amount)'));

        $costItems = (float) $order->costItems()
            ->sum(\DB::raw('COALESCE(real_amount, estimated_amount)'));

        $overhead = (float) $order->workshop_overhead_amount;

        return round($purchases + $costItems + $overhead, 2);
    }

    /**
     * Estimated profit = approved revenue - estimated costs.
     */
    public function calculateEstimatedProfit(CrmOrder $order): float
    {
        $approved = (float) $order->approved_amount;
        $costs = $this->calculateEstimatedCosts($order);

        return round($approved - $costs, 2);
    }

    /**
     * Real profit = approved revenue - real costs.
     */
    public function calculateRealProfit(CrmOrder $order): float
    {
        $approved = (float) $order->approved_amount;
        $costs = $this->calculateRealCosts($order);

        return round($approved - $costs, 2);
    }

    /**
     * Estimated margin % = (estimated profit / approved revenue) * 100.
     */
    public function calculateEstimatedMarginPercent(CrmOrder $order): float
    {
        $approved = (float) $order->approved_amount;
        if ($approved <= 0) {
            return 0.0;
        }
        $profit = $this->calculateEstimatedProfit($order);

        return round(($profit / $approved) * 100, 2);
    }

    /**
     * Real margin % = (real profit / approved revenue) * 100.
     */
    public function calculateRealMarginPercent(CrmOrder $order): float
    {
        $approved = (float) $order->approved_amount;
        if ($approved <= 0) {
            return 0.0;
        }
        $profit = $this->calculateRealProfit($order);

        return round(($profit / $approved) * 100, 2);
    }

    /**
     * Determine automatic financial status based strictly on movements and rules.
     */
    public function determineFinancialStatus(CrmOrder $order): string
    {
        if ($order->commercial_status === 'cancelado') {
            return 'Cancelado con ajuste';
        }

        $approved = (float) $order->approved_amount;
        $collected = $this->calculateTotalCollected($order);
        $advanceRequired = (float) $order->advance_required;

        if ($approved <= 0) {
            return 'Liquidado';
        }

        if ($collected >= $approved) {
            return 'Liquidado';
        }

        if ($advanceRequired > 0) {
            $pendingAdvance = $this->calculatePendingAdvance($order);
            if ($pendingAdvance == $advanceRequired && $collected <= 0) {
                return 'Sin anticipo registrado';
            }
            if ($pendingAdvance > 0 && $collected < $advanceRequired) {
                return 'Anticipo parcial';
            }
            if ($pendingAdvance <= 0 && $collected < $approved) {
                return 'Anticipo cubierto';
            }
        }

        if ($collected > 0 && $collected < $approved) {
            return 'Pago parcial';
        }

        return 'Sin anticipo registrado';
    }

    /**
     * Global financial summary across orders with optional universe and date filtering.
     */
    public function getGlobalFinancialSummary(?string $universe = null, ?string $startDate = null, ?string $endDate = null): array
    {
        $ordersQuery = CrmOrder::query();

        if ($universe && $universe !== 'all') {
            $ordersQuery->where('universe', $universe);
        }

        if ($startDate) {
            $ordersQuery->where('requested_at', '>=', $startDate);
        }

        if ($endDate) {
            $ordersQuery->where('requested_at', '<=', $endDate);
        }

        $orders = $ordersQuery->with(['payments', 'purchases', 'costItems', 'adjustments'])->get();

        $totalApproved = 0.0;
        $totalCollected = 0.0;
        $totalBalanceDue = 0.0;
        $totalPendingAdvance = 0.0;
        $totalEstimatedCosts = 0.0;
        $totalRealCosts = 0.0;
        $totalEstimatedProfit = 0.0;

        foreach ($orders as $order) {
            $totalApproved += (float) $order->approved_amount;
            $collected = $this->calculateTotalCollected($order);
            $totalCollected += $collected;
            $totalBalanceDue += $this->calculateBalanceDue($order);
            $totalPendingAdvance += $this->calculatePendingAdvance($order);
            $estCost = $this->calculateEstimatedCosts($order);
            $realCost = $this->calculateRealCosts($order);
            $totalEstimatedCosts += $estCost;
            $totalRealCosts += $realCost;
            $totalEstimatedProfit += ($order->approved_amount - $estCost);
        }

        // Purchases pending payment to suppliers
        $purchasesQuery = CrmPurchase::query()
            ->where('purchase_status', '!=', 'cancelled');

        if ($universe && $universe !== 'all') {
            $purchasesQuery->whereHas('order', fn ($q) => $q->where('universe', $universe));
        }

        $purchases = $purchasesQuery->with('payments')->get();
        $totalPurchasesCommitted = 0.0;
        $totalSupplierDebt = 0.0;

        foreach ($purchases as $p) {
            $cost = $p->effective_cost;
            $totalPurchasesCommitted += $cost;
            $paid = (float) $p->payments->sum('amount');
            $totalSupplierDebt += max(0, $cost - $paid);
        }

        return [
            'total_approved' => round($totalApproved, 2),
            'total_collected' => round($totalCollected, 2),
            'total_balance_due' => round($totalBalanceDue, 2),
            'total_pending_advance' => round($totalPendingAdvance, 2),
            'total_purchases_committed' => round($totalPurchasesCommitted, 2),
            'total_supplier_debt' => round($totalSupplierDebt, 2),
            'total_estimated_costs' => round($totalEstimatedCosts, 2),
            'total_real_costs' => round($totalRealCosts, 2),
            'total_estimated_profit' => round($totalEstimatedProfit, 2),
            'estimated_margin_percent' => $totalApproved > 0 ? round(($totalEstimatedProfit / $totalApproved) * 100, 2) : 0,
            'orders_count' => $orders->count(),
        ];
    }
}
