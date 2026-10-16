<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use App\Models\Client;
use App\Models\CrmActivityLog;
use App\Models\CrmOrder;
use App\Models\CrmSupplier;
use App\Models\User;
use App\Services\CrmFinancialService;
use App\Services\CrmWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmOrderController extends Controller
{
    public function __construct(
        protected CrmFinancialService $financialService,
        protected CrmWorkflowService $workflowService
    ) {}

    public function index(Request $request): Response
    {
        $universe = $request->query('universe', 'all');
        $operatingStatus = $request->query('operating_status');
        $commercialStatus = $request->query('commercial_status');
        $priority = $request->query('priority');
        $search = $request->query('search');

        $query = CrmOrder::with(['client', 'assignedUser', 'quotation']);

        if ($universe !== 'all') {
            $query->where('universe', $universe);
        }

        if ($operatingStatus) {
            $query->where('operating_status', $operatingStatus);
        }

        if ($commercialStatus) {
            $query->where('commercial_status', $commercialStatus);
        }

        if ($priority) {
            $query->where('priority', $priority);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('folio', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhereHas('client', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
            });
        }

        $orders = $query->latest('requested_at')->paginate(15)->withQueryString();

        return Inertia::render('admin/crm/orders/index', [
            'orders' => $orders,
            'filters' => [
                'universe' => $universe,
                'operating_status' => $operatingStatus,
                'commercial_status' => $commercialStatus,
                'priority' => $priority,
                'search' => $search,
            ],
            'operating_statuses' => [
                'no_iniciado' => 'No iniciado',
                'pendiente_informacion' => 'Pendiente de información',
                'pendiente_aprobacion' => 'Pendiente de aprobación',
                'pendiente_compra' => 'Pendiente de compra',
                'pendiente_recepcion' => 'Pendiente de recepción',
                'listo_produccion' => 'Listo para producción',
                'en_produccion' => 'En producción',
                'en_revision_interna' => 'En revisión interna',
                'pendiente_aprobacion_final' => 'Pendiente de aprobación final',
                'listo_para_entregar' => 'Listo para entregar',
                'entregado' => 'Entregado',
                'bloqueado' => 'En pausa o bloqueado',
            ],
        ]);
    }

    public function create(): Response
    {
        $clients = Client::where('status', 'active')->orderBy('name')->get(['id', 'name', 'business_name', 'phone']);
        $users = User::all(['id', 'name']);

        return Inertia::render('admin/crm/orders/create', [
            'clients' => $clients,
            'users' => $users,
            'default_advance_percent' => (float) BusinessSetting::get('default_advance_percent', 50),
            'workshop_overhead_value' => (float) BusinessSetting::get('workshop_overhead_value', 15),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'universe' => 'required|in:print,studio,moments',
            'project_name' => 'required|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'requested_at' => 'required|date',
            'start_planned_at' => 'nullable|date',
            'delivery_agreed_at' => 'nullable|date',
            'internal_deadline_at' => 'nullable|date',
            'priority' => 'required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'approved_amount' => 'required|numeric|min:0',
            'advance_required' => 'nullable|numeric|min:0',
            'workshop_overhead_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $folio = $this->workflowService->generateFolio('order', $validated['universe']);
        $advance = isset($validated['advance_required']) ? (float) $validated['advance_required'] : round($validated['approved_amount'] * 0.5, 2);

        $order = CrmOrder::create([
            ...$validated,
            'folio' => $folio,
            'advance_required' => $advance,
            'workshop_overhead_type' => 'percent',
            'workshop_overhead_amount' => $validated['workshop_overhead_amount'] ?? round($validated['approved_amount'] * 0.15, 2),
            'commercial_status' => 'confirmado',
            'operating_status' => 'no_iniciado',
        ]);

        // Initialize standard tasks from universe template
        $this->workflowService->initializeOrderTasks($order);

        CrmActivityLog::log($order, 'created', "Pedido {$order->folio} creado por un importe aprobado de $".number_format($order->approved_amount, 2));

        return redirect()->route('admin.crm-orders.show', $order->id)
            ->with('success', "Pedido {$order->folio} creado exitosamente con sus tareas iniciales");
    }

    public function show(CrmOrder $crmOrder): Response
    {
        $crmOrder->load([
            'client',
            'quotation',
            'assignedUser',
            'tasks.assignedUser',
            'approvals.creator',
            'purchases.supplier',
            'purchases.payments',
            'payments.registeredByUser',
            'costItems',
            'adjustments.registeredByUser',
            'activityLogs.user',
        ]);

        $suppliers = CrmSupplier::where('status', 'active')->orderBy('name')->get(['id', 'name', 'category']);
        $users = User::all(['id', 'name']);

        // Detailed financial breakdown computed by CrmFinancialService
        $financialSummary = [
            'approved_amount' => (float) $crmOrder->approved_amount,
            'advance_required' => (float) $crmOrder->advance_required,
            'total_collected' => $crmOrder->total_collected,
            'balance_due' => $crmOrder->balance_due,
            'pending_advance' => $crmOrder->pending_advance,
            'estimated_costs' => $crmOrder->estimated_costs,
            'real_costs' => $crmOrder->real_costs,
            'estimated_profit' => $crmOrder->estimated_profit,
            'real_profit' => $crmOrder->real_profit,
            'estimated_margin_percent' => $crmOrder->estimated_margin_percent,
            'real_margin_percent' => $this->financialService->calculateRealMarginPercent($crmOrder),
            'financial_status' => $crmOrder->financial_status,
            'workshop_overhead' => (float) $crmOrder->workshop_overhead_amount,
        ];

        return Inertia::render('admin/crm/orders/show', [
            'order' => $crmOrder,
            'financial_summary' => $financialSummary,
            'suppliers' => $suppliers,
            'users' => $users,
        ]);
    }

    public function update(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'project_name' => 'sometimes|required|string|max:255',
            'service_type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'assigned_to' => 'nullable|exists:users,id',
            'delivery_agreed_at' => 'nullable|date',
            'next_milestone_at' => 'nullable|date',
            'internal_deadline_at' => 'nullable|date',
            'approved_amount' => 'sometimes|required|numeric|min:0',
            'advance_required' => 'nullable|numeric|min:0',
            'workshop_overhead_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        $crmOrder->update($validated);

        CrmActivityLog::log($crmOrder, 'updated', "Pedido {$crmOrder->folio} actualizado");

        return redirect()->back()->with('success', 'Pedido actualizado correctamente');
    }

    public function updateOperatingStatus(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'operating_status' => 'required|string',
            'blocked_reason' => 'nullable|string|required_if:operating_status,bloqueado',
        ]);

        $oldStatus = $crmOrder->operating_status;
        $updates = [
            'operating_status' => $validated['operating_status'],
            'blocked_reason' => $validated['operating_status'] === 'bloqueado' ? $validated['blocked_reason'] : null,
        ];

        if ($validated['operating_status'] === 'entregado' && ! $crmOrder->delivered_at) {
            $updates['delivered_at'] = now()->toDateString();
        }

        $crmOrder->update($updates);

        CrmActivityLog::log(
            $crmOrder,
            'status_changed',
            "Estado operativo de {$crmOrder->folio} cambió de '{$oldStatus}' a '{$validated['operating_status']}'",
            ['old' => $oldStatus, 'new' => $validated['operating_status'], 'reason' => $validated['blocked_reason'] ?? null]
        );

        return redirect()->back()->with('success', 'Estado operativo actualizado');
    }

    public function updateCommercialStatus(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'commercial_status' => 'required|in:cotizado,confirmado,en_proceso,entregado,cerrado,cancelado',
        ]);

        $oldStatus = $crmOrder->commercial_status;
        $updates = ['commercial_status' => $validated['commercial_status']];

        if ($validated['commercial_status'] === 'cerrado' && ! $crmOrder->closed_at) {
            $updates['closed_at'] = now()->toDateString();
        }

        $crmOrder->update($updates);

        CrmActivityLog::log(
            $crmOrder,
            'status_changed',
            "Estado comercial de {$crmOrder->folio} cambió de '{$oldStatus}' a '{$validated['commercial_status']}'",
            ['old' => $oldStatus, 'new' => $validated['commercial_status']]
        );

        return redirect()->back()->with('success', 'Estado comercial actualizado');
    }

    public function destroy(CrmOrder $crmOrder): RedirectResponse
    {
        $crmOrder->delete();
        CrmActivityLog::log($crmOrder, 'deleted', "Pedido {$crmOrder->folio} eliminado/archivado");

        return redirect()->route('admin.crm-orders.index')->with('success', 'Pedido archivado');
    }
}
