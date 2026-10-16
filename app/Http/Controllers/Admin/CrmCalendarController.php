<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmOrder;
use App\Models\CrmPurchase;
use App\Models\CrmTask;
use App\Models\Opportunity;
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

        // 1. Order Deliveries
        $ordersQuery = CrmOrder::whereNotNull('delivery_agreed_at')
            ->whereBetween('delivery_agreed_at', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with('client');

        if ($universe !== 'all') {
            $ordersQuery->where('universe', $universe);
        }

        $deliveries = $ordersQuery->get()->map(fn ($order) => [
            'id' => 'delivery-'.$order->id,
            'title' => 'Entrega: '.$order->project_name,
            'date' => $order->delivery_agreed_at->toDateString(),
            'type' => 'delivery',
            'universe' => $order->universe,
            'status' => $order->operating_status,
            'client_name' => $order->client->name,
            'url' => route('admin.crm-orders.show', $order->id),
        ]);

        // 2. Task Deadlines
        $tasksQuery = CrmTask::whereNotNull('due_date')
            ->whereBetween('due_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with(['order.client', 'assignedUser']);

        if ($universe !== 'all') {
            $tasksQuery->whereHas('order', fn ($q) => $q->where('universe', $universe));
        }

        $tasks = $tasksQuery->get()->map(fn ($task) => [
            'id' => 'task-'.$task->id,
            'title' => $task->title.' ('.$task->order->folio.')',
            'date' => $task->due_date->toDateString(),
            'type' => 'task',
            'universe' => $task->order->universe,
            'status' => $task->status,
            'priority' => $task->priority,
            'url' => route('admin.crm-orders.show', $task->order_id),
        ]);

        // 3. Purchase Receptions
        $purchasesQuery = CrmPurchase::whereNotNull('expected_delivery_date')
            ->whereBetween('expected_delivery_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with(['supplier', 'order']);

        if ($universe !== 'all') {
            $purchasesQuery->whereHas('order', fn ($q) => $q->where('universe', $universe));
        }

        $purchases = $purchasesQuery->get()->map(fn ($p) => [
            'id' => 'purchase-'.$p->id,
            'title' => 'Recepción: '.$p->concept.' ('.$p->supplier->name.')',
            'date' => $p->expected_delivery_date->toDateString(),
            'type' => 'purchase',
            'universe' => $p->order?->universe ?? 'print',
            'status' => $p->purchase_status,
            'url' => route('admin.purchases.index', ['search' => $p->folio]),
        ]);

        // 4. Commercial Followups
        $oppQuery = Opportunity::whereNotNull('next_followup_date')
            ->whereBetween('next_followup_date', [$startOfMonth->toDateString(), $endOfMonth->toDateString()])
            ->with('client');

        if ($universe !== 'all') {
            $oppQuery->where('universe', $universe);
        }

        $followups = $oppQuery->get()->map(fn ($opp) => [
            'id' => 'followup-'.$opp->id,
            'title' => 'Seguimiento: '.$opp->title,
            'date' => $opp->next_followup_date->toDateString(),
            'type' => 'followup',
            'universe' => $opp->universe,
            'status' => $opp->stage,
            'client_name' => $opp->client->name,
            'url' => route('admin.opportunities.index', ['universe' => $opp->universe]),
        ]);

        $allEvents = $deliveries->concat($tasks)->concat($purchases)->concat($followups);

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
