<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivityLog;
use App\Models\CrmOrder;
use App\Models\CrmOrderApproval;
use App\Models\CrmTask;
use App\Models\Opportunity;
use App\Models\Quotation;
use App\Services\CrmFinancialService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmDashboardController extends Controller
{
    public function __construct(
        protected CrmFinancialService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $universe = $request->query('universe', 'all'); // 'all', 'print', 'studio', 'moments'
        $period = $request->query('period', 'month'); // 'month', 'quarter', 'year', 'all'

        $dateRange = match ($period) {
            'quarter' => [Carbon::now()->startOfQuarter()->toDateString(), Carbon::now()->endOfQuarter()->toDateString()],
            'year' => [Carbon::now()->startOfYear()->toDateString(), Carbon::now()->endOfYear()->toDateString()],
            'all' => [null, null],
            default => [Carbon::now()->startOfMonth()->toDateString(), Carbon::now()->endOfMonth()->toDateString()],
        };

        // Orders query scope
        $orderQuery = CrmOrder::query();
        if ($universe !== 'all') {
            $orderQuery->where('universe', $universe);
        }

        // Active Orders
        $activeOrdersCount = (clone $orderQuery)
            ->whereNotIn('commercial_status', ['cerrado', 'cancelado'])
            ->whereNotIn('operating_status', ['entregado'])
            ->count();

        // New contacts needing attention
        $oppQuery = Opportunity::query();
        if ($universe !== 'all') {
            $oppQuery->where('universe', $universe);
        }
        $newContactsCount = (clone $oppQuery)
            ->where('stage', 'nuevo_contacto')
            ->count();

        // Quotations pending preparation
        $pendingPrepQuotesCount = (clone $oppQuery)
            ->whereIn('stage', ['por_cotizar', 'cotizacion_en_preparacion'])
            ->count();

        // Quotations sent without reply
        $quoteQuery = Quotation::query();
        if ($universe !== 'all') {
            $quoteQuery->where('universe', $universe);
        }
        $sentQuotesCount = (clone $quoteQuery)
            ->where('status', 'sent')
            ->count();

        // Upcoming deliveries (next 7 days)
        $today = Carbon::today()->toDateString();
        $nextWeek = Carbon::today()->addDays(7)->toDateString();

        $upcomingDeliveries = (clone $orderQuery)
            ->whereNotNull('delivery_agreed_at')
            ->whereBetween('delivery_agreed_at', [$today, $nextWeek])
            ->whereNotIn('operating_status', ['entregado', 'cerrado'])
            ->with('client')
            ->orderBy('delivery_agreed_at')
            ->limit(8)
            ->get();

        $upcomingDeliveriesCount = $upcomingDeliveries->count();

        // Overdue tasks
        $taskQuery = CrmTask::query()
            ->whereIn('status', ['pending', 'in_progress'])
            ->where('due_date', '<', $today);

        if ($universe !== 'all') {
            $taskQuery->whereHas('order', fn ($q) => $q->where('universe', $universe));
        }

        $overdueTasksCount = $taskQuery->count();
        $priorityTasks = $taskQuery->with(['order.client', 'assignedUser'])
            ->orderBy('due_date')
            ->limit(6)
            ->get();

        // Blocked orders
        $blockedOrders = (clone $orderQuery)
            ->where('operating_status', 'bloqueado')
            ->with('client')
            ->get();

        // Pending approvals
        $pendingApprovalsQuery = CrmOrderApproval::query()
            ->where('status', 'sent');

        if ($universe !== 'all') {
            $pendingApprovalsQuery->whereHas('order', fn ($q) => $q->where('universe', $universe));
        }
        $pendingApprovalsCount = $pendingApprovalsQuery->count();

        // Financial Overview (using strict financial service)
        $financialSummary = $this->financialService->getGlobalFinancialSummary(
            $universe,
            $dateRange[0],
            $dateRange[1]
        );

        // Financial breakdown by universe
        $universeFinancials = [
            'print' => $this->financialService->getGlobalFinancialSummary('print', $dateRange[0], $dateRange[1]),
            'studio' => $this->financialService->getGlobalFinancialSummary('studio', $dateRange[0], $dateRange[1]),
            'moments' => $this->financialService->getGlobalFinancialSummary('moments', $dateRange[0], $dateRange[1]),
        ];

        // Quotes needing followup
        $followupQuotes = (clone $quoteQuery)
            ->whereIn('status', ['sent', 'in_followup'])
            ->with('client')
            ->orderBy('sent_date', 'desc')
            ->limit(5)
            ->get();

        // Recent Activity Log
        $recentActivities = CrmActivityLog::with('user')
            ->latest()
            ->limit(10)
            ->get();

        return Inertia::render('admin/crm/dashboard', [
            'filters' => [
                'universe' => $universe,
                'period' => $period,
            ],
            'kpis' => [
                'active_orders' => $activeOrdersCount,
                'new_contacts' => $newContactsCount,
                'quotes_pending_prep' => $pendingPrepQuotesCount,
                'quotes_sent' => $sentQuotesCount,
                'upcoming_deliveries' => $upcomingDeliveriesCount,
                'overdue_tasks' => $overdueTasksCount,
                'blocked_orders' => $blockedOrders->count(),
                'pending_approvals' => $pendingApprovalsCount,
                'pending_advance' => $financialSummary['total_pending_advance'],
                'balance_due' => $financialSummary['total_balance_due'],
                'supplier_debt' => $financialSummary['total_supplier_debt'],
                'total_collected' => $financialSummary['total_collected'],
                'total_approved' => $financialSummary['total_approved'],
                'estimated_costs' => $financialSummary['total_estimated_costs'],
                'real_costs' => $financialSummary['total_real_costs'],
                'estimated_profit' => $financialSummary['total_estimated_profit'],
                'estimated_margin_percent' => $financialSummary['estimated_margin_percent'],
            ],
            'upcoming_deliveries' => $upcomingDeliveries,
            'priority_tasks' => $priorityTasks,
            'blocked_orders' => $blockedOrders,
            'followup_quotes' => $followupQuotes,
            'universe_financials' => $universeFinancials,
            'recent_activities' => $recentActivities,
        ]);
    }
}
