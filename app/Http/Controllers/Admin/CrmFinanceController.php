<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmCustomerPayment;
use App\Models\CrmFinancialAdjustment;
use App\Models\CrmOrder;
use App\Models\CrmOrderCostItem;
use App\Services\CrmFinancialService;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmFinanceController extends Controller
{
    public function __construct(
        protected CrmFinancialService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $universe = $request->query('universe', 'all');
        $startDate = $request->query('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->endOfMonth()->toDateString());

        $summary = $this->financialService->getGlobalFinancialSummary($universe, $startDate, $endDate);

        $universeSummaries = [
            'print' => $this->financialService->getGlobalFinancialSummary('print', $startDate, $endDate),
            'studio' => $this->financialService->getGlobalFinancialSummary('studio', $startDate, $endDate),
            'moments' => $this->financialService->getGlobalFinancialSummary('moments', $startDate, $endDate),
        ];

        // Recent customer payments in period
        $recentPayments = CrmCustomerPayment::with(['order', 'client'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->latest('payment_date')
            ->limit(20)
            ->get();

        // Orders with pending balances
        $ordersWithBalance = CrmOrder::whereNotIn('commercial_status', ['cancelado'])
            ->with(['client', 'payments'])
            ->get()
            ->filter(fn (CrmOrder $o) => $o->balance_due > 0)
            ->sortByDesc('balance_due')
            ->values()
            ->take(15);

        return Inertia::render('admin/crm/finances/index', [
            'summary' => $summary,
            'universe_summaries' => $universeSummaries,
            'recent_payments' => $recentPayments,
            'orders_with_balance' => $ordersWithBalance,
            'filters' => [
                'universe' => $universe,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    public function storeAdjustment(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:discount,price_adjustment,refund_adjustment,cancellation_balance',
            'amount' => 'required|numeric|min:0.01',
            'reason' => 'required|string|min:5',
        ]);

        CrmFinancialAdjustment::create([
            'order_id' => $crmOrder->id,
            'type' => $validated['type'],
            'amount' => (float) $validated['amount'],
            'reason' => $validated['reason'],
            'registered_by' => auth()->id() ?? 1,
        ]);

        return redirect()->back()->with('success', 'Ajuste financiero registrado correctamente');
    }

    public function storeCostItem(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string',
            'concept' => 'required|string|max:255',
            'estimated_amount' => 'required|numeric|min:0',
            'real_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        CrmOrderCostItem::create([
            'order_id' => $crmOrder->id,
            'category' => $validated['category'],
            'concept' => $validated['concept'],
            'estimated_amount' => (float) $validated['estimated_amount'],
            'real_amount' => isset($validated['real_amount']) ? (float) $validated['real_amount'] : null,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()->with('success', 'Partida de costo añadida al pedido');
    }
}
