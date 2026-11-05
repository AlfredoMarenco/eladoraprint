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

        // 1. Fechas de Entrega Acordadas (solo pedidos activos / no cancelados)
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

        // 2. Fechas de Pedidos Confirmados (solicitud / inicio de pedido confirmado)
        $confirmedOrdersQuery = CrmOrder::where('commercial_status', '!=', 'cancelado')
            ->whereNotNull('requested_at')
            ->whereBetween('requested_at', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with('client');

        if ($universe !== 'all') {
            $confirmedOrdersQuery->where('universe', $universe);
        }

        $confirmedOrders = $confirmedOrdersQuery->get()->map(fn ($order) => [
            'id' => 'order-'.$order->id,
            'title' => 'Pedido: '.$order->project_name.' ('.$order->folio.')',
            'date' => $order->requested_at->toDateString(),
            'type' => 'confirmed_order',
            'universe' => $order->universe,
            'status' => $order->commercial_status,
            'client_name' => $order->client?->name ?? 'Sin cliente',
            'url' => route('admin.crm-orders.show', $order->id),
        ]);

        $allEvents = $deliveries->concat($confirmedOrders)->sortBy('date')->values();

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
