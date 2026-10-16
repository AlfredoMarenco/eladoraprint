<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmOrder;
use App\Models\Opportunity;
use App\Models\Quotation;
use App\Services\CrmFinancialService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CrmReportController extends Controller
{
    public function __construct(
        protected CrmFinancialService $financialService
    ) {}

    public function index(Request $request): Response
    {
        $startDate = $request->query('start_date', Carbon::now()->startOfYear()->toDateString());
        $endDate = $request->query('end_date', Carbon::now()->toDateString());

        // Orders by universe
        $ordersByUniverse = [
            'print' => CrmOrder::where('universe', 'print')->whereBetween('requested_at', [$startDate, $endDate])->count(),
            'studio' => CrmOrder::where('universe', 'studio')->whereBetween('requested_at', [$startDate, $endDate])->count(),
            'moments' => CrmOrder::where('universe', 'moments')->whereBetween('requested_at', [$startDate, $endDate])->count(),
        ];

        // Orders by operating status
        $ordersByStatus = CrmOrder::whereBetween('requested_at', [$startDate, $endDate])
            ->selectRaw('operating_status, count(*) as count')
            ->groupBy('operating_status')
            ->pluck('count', 'operating_status');

        // Delivery punctuality
        $deliveredOrders = CrmOrder::whereNotNull('delivered_at')
            ->whereNotNull('delivery_agreed_at')
            ->whereBetween('requested_at', [$startDate, $endDate])
            ->get();

        $onTimeCount = $deliveredOrders->filter(fn ($o) => $o->delivered_at <= $o->delivery_agreed_at)->count();
        $lateCount = $deliveredOrders->count() - $onTimeCount;

        // Commercial Conversion Funnel
        $totalLeads = Opportunity::whereBetween('entry_date', [$startDate, $endDate])->count();
        $totalQuotes = Quotation::whereBetween('creation_date', [$startDate, $endDate])->count();
        $acceptedQuotes = Quotation::where('status', 'accepted')->whereBetween('creation_date', [$startDate, $endDate])->count();
        $convertedOrders = CrmOrder::whereNotNull('quotation_id')->whereBetween('requested_at', [$startDate, $endDate])->count();

        // Financial totals in period
        $financialSummary = $this->financialService->getGlobalFinancialSummary('all', $startDate, $endDate);

        return Inertia::render('admin/crm/reports/index', [
            'orders_by_universe' => $ordersByUniverse,
            'orders_by_status' => $ordersByStatus,
            'punctuality' => [
                'total_delivered' => $deliveredOrders->count(),
                'on_time' => $onTimeCount,
                'late' => $lateCount,
                'rate' => $deliveredOrders->count() > 0 ? round(($onTimeCount / $deliveredOrders->count()) * 100, 1) : 100,
            ],
            'funnel' => [
                'leads' => $totalLeads,
                'quotes' => $totalQuotes,
                'accepted_quotes' => $acceptedQuotes,
                'converted_orders' => $convertedOrders,
                'conversion_rate' => $totalQuotes > 0 ? round(($acceptedQuotes / $totalQuotes) * 100, 1) : 0,
            ],
            'financial_summary' => $financialSummary,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Export CRM orders to CSV.
     */
    public function exportOrdersCsv(Request $request): StreamedResponse
    {
        $fileName = 'pedidos_eladora_'.date('Y-m-d').'.csv';

        $orders = CrmOrder::with(['client', 'assignedUser'])->latest('requested_at')->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ];

        return response()->stream(function () use ($orders) {
            $handle = fopen('php://output', 'w');
            // Add UTF-8 BOM for Excel compatibility
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'Folio',
                'Cliente',
                'Universo',
                'Proyecto',
                'Estado Operativo',
                'Estado Comercial',
                'Importe Aprobado',
                'Anticipo Requerido',
                'Cobrado',
                'Saldo Pendiente',
                'Fecha Solicitud',
                'Fecha Entrega Acordada',
            ]);

            foreach ($orders as $o) {
                fputcsv($handle, [
                    $o->folio,
                    $o->client->name,
                    ucfirst($o->universe),
                    $o->project_name,
                    $o->operating_status,
                    $o->commercial_status,
                    $o->approved_amount,
                    $o->advance_required,
                    $o->total_collected,
                    $o->balance_due,
                    $o->requested_at?->format('Y-m-d'),
                    $o->delivery_agreed_at?->format('Y-m-d'),
                ]);
            }

            fclose($handle);
        }, 200, $headers);
    }
}
