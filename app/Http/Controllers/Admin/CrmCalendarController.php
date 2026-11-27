<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmOrder;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmCalendarController extends Controller
{
    public function index(Request $request): Response
    {
        $universe = $request->query('universe', 'all');
        $month = $request->query('month', date('Y-m'));
        $view = $request->query('view', 'month'); // 'month', 'week', 'agenda'

        $startOfMonth = Carbon::parse($month.'-01')->startOfMonth()->subDays(7);
        $endOfMonth = Carbon::parse($month.'-01')->endOfMonth()->addDays(7);

        // 1. Fechas de Entrega Acordadas (pedidos activos no cancelados)
        $deliveriesQuery = CrmOrder::where('commercial_status', '!=', 'cancelado')
            ->whereNotNull('delivery_agreed_at')
            ->whereBetween('delivery_agreed_at', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with('client');

        if ($universe !== 'all') {
            $deliveriesQuery->where('universe', $universe);
        }

        $deliveries = $deliveriesQuery->get()->map(fn ($order) => [
            'id' => 'delivery-'.$order->id,
            'title' => 'Entrega: '.$order->project_name.' ('.$order->folio.')',
            'date' => $order->delivery_agreed_at->toDateString(),
            'type' => 'delivery',
            'universe' => $order->universe,
            'status' => $order->operating_status,
            'client_name' => $order->client?->name ?? 'Sin cliente',
            'url' => route('admin.crm-orders.show', $order->id),
        ]);

        // 2. Fechas Límite Internas (deadlines de producción)
        $deadlinesQuery = CrmOrder::where('commercial_status', '!=', 'cancelado')
            ->whereNotNull('internal_deadline_at')
            ->whereBetween('internal_deadline_at', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with('client');

        if ($universe !== 'all') {
            $deadlinesQuery->where('universe', $universe);
        }

        $deadlines = $deadlinesQuery->get()->map(fn ($order) => [
            'id' => 'deadline-'.$order->id,
            'title' => 'Fecha Límite: '.$order->project_name.' ('.$order->folio.')',
            'date' => $order->internal_deadline_at->toDateString(),
            'type' => 'deadline',
            'universe' => $order->universe,
            'status' => $order->operating_status,
            'client_name' => $order->client?->name ?? 'Sin cliente',
            'url' => route('admin.crm-orders.show', $order->id),
        ]);

        // 3. Fechas de Inicio de Producción / Pedidos (start_planned_at o requested_at)
        $productionStartsQuery = CrmOrder::where('commercial_status', '!=', 'cancelado')
            ->where(function ($q) use ($startOfMonth, $endOfMonth) {
                $q->whereBetween('start_planned_at', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
                    ->orWhere(function ($sq) use ($startOfMonth, $endOfMonth) {
                        $sq->whereNull('start_planned_at')
                            ->whereBetween('requested_at', [$startOfMonth->toDateString(), $endOfMonth->toDateString()]);
                    });
            })
            ->with('client');

        if ($universe !== 'all') {
            $productionStartsQuery->where('universe', $universe);
        }

        $productionStarts = $productionStartsQuery->get()->map(function ($order) {
            $startDate = $order->start_planned_at ?? $order->requested_at;

            return [
                'id' => 'start-'.$order->id,
                'title' => 'Inicio Producción: '.$order->project_name.' ('.$order->folio.')',
                'date' => $startDate->toDateString(),
                'type' => 'production_start',
                'universe' => $order->universe,
                'status' => $order->operating_status,
                'client_name' => $order->client?->name ?? 'Sin cliente',
                'url' => route('admin.crm-orders.show', $order->id),
            ];
        });

        $allEvents = $deliveries
            ->concat($deadlines)
            ->concat($productionStarts)
            ->sortBy('date')
            ->values();

        return Inertia::render('admin/crm/calendar/index', [
            'events' => $allEvents,
            'filters' => [
                'universe' => $universe,
                'month' => $month,
                'view' => $view,
            ],
        ]);
    }
}
