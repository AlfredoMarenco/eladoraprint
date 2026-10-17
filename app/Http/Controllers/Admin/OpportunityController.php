<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\CrmActivityLog;
use App\Models\Opportunity;
use App\Models\Quotation;
use App\Models\User;
use App\Services\CrmWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityController extends Controller
{
    public function __construct(
        protected CrmWorkflowService $workflowService
    ) {}

    public function index(Request $request): Response
    {
        $universe = $request->query('universe', 'all');
        $stage = $request->query('stage');
        $priority = $request->query('priority');
        $view = $request->query('view', 'kanban'); // 'kanban' or 'table'

        $query = Opportunity::with(['client', 'assignedUser']);

        if ($universe !== 'all') {
            $query->where('universe', $universe);
        }

        if ($stage) {
            $query->where('stage', $stage);
        }

        if ($priority) {
            $query->where('priority', $priority);
        }

        $opportunities = $query->latest('entry_date')->latest('id')->get();
        $clients = Client::where('status', 'active')->orderBy('name')->get(['id', 'name', 'business_name', 'phone']);
        $users = User::all(['id', 'name']);

        // Group into Kanban stages
        $stages = [
            'nuevo_contacto' => 'Nuevo Contacto',
            'por_cotizar' => 'Por Cotizar',
            'cotizacion_en_preparacion' => 'En Preparación',
            'cotizacion_enviada' => 'Cotización Enviada',
            'en_seguimiento' => 'En Seguimiento',
            'aceptada' => 'Aceptada (Pendiente Anticipo)',
            'confirmado' => 'Confirmado',
            'perdido' => 'Perdido / Rechazado',
            'cancelado' => 'Cancelado',
        ];

        return Inertia::render('admin/crm/opportunities/index', [
            'opportunities' => $opportunities,
            'stages' => $stages,
            'clients' => $clients,
            'users' => $users,
            'filters' => [
                'universe' => $universe,
                'stage' => $stage,
                'priority' => $priority,
                'view' => $view,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'universe' => 'required|in:print,studio,moments',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'contact_channel' => 'nullable|string',
            'entry_date' => 'required|date',
            'next_followup_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'priority' => 'required|in:low,medium,high,urgent',
            'estimated_amount' => 'nullable|numeric|min:0',
            'stage' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $folio = $this->workflowService->generateFolio('opportunity', $validated['universe']);

        $opportunity = Opportunity::create([
            ...$validated,
            'folio' => $folio,
            'last_contact_date' => now()->toDateString(),
        ]);

        CrmActivityLog::log($opportunity, 'created', "Oportunidad comercial {$opportunity->folio} creada para {$opportunity->client->name}");

        return redirect()->back()->with('success', 'Oportunidad creada exitosamente');
    }

    public function update(Request $request, Opportunity $opportunity): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'title' => 'sometimes|required|string|max:255',
            'universe' => 'sometimes|required|in:print,studio,moments',
            'description' => 'nullable|string',
            'stage' => 'sometimes|required|string',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'estimated_amount' => 'nullable|numeric|min:0',
            'entry_date' => 'sometimes|required|date',
            'next_followup_date' => 'nullable|date',
            'assigned_to' => 'nullable|exists:users,id',
            'contact_channel' => 'nullable|string',
            'notes' => 'nullable|string',
            'lost_reason' => 'nullable|string',
        ]);

        $oldStage = $opportunity->stage;
        $opportunity->update($validated);

        if (isset($validated['stage']) && $validated['stage'] !== $oldStage) {
            CrmActivityLog::log($opportunity, 'status_changed', "Etapa de {$opportunity->folio} cambiada de {$oldStage} a {$validated['stage']}");
        }

        return redirect()->back()->with('success', 'Oportunidad actualizada');
    }

    /**
     * Convert an opportunity into a Quotation draft prefilling client data.
     */
    public function convertToQuotation(Opportunity $opportunity): RedirectResponse
    {
        $folio = $this->workflowService->generateFolio('quotation', $opportunity->universe);

        $quotation = Quotation::create([
            'folio' => $folio,
            'client_id' => $opportunity->client_id,
            'opportunity_id' => $opportunity->id,
            'universe' => $opportunity->universe,
            'project_name' => $opportunity->title,
            'description' => $opportunity->description,
            'items' => [
                [
                    'concept' => $opportunity->title,
                    'description' => $opportunity->description ?? 'Servicio solicitado',
                    'quantity' => 1,
                    'unit_price' => $opportunity->estimated_amount ?? 0,
                    'subtotal' => $opportunity->estimated_amount ?? 0,
                ],
            ],
            'subtotal' => $opportunity->estimated_amount ?? 0,
            'total_amount' => $opportunity->estimated_amount ?? 0,
            'advance_required' => ($opportunity->estimated_amount ?? 0) * 0.5,
            'creation_date' => now()->toDateString(),
            'status' => 'draft',
            'version' => 1,
        ]);

        $opportunity->update(['stage' => 'cotizacion_en_preparacion']);

        CrmActivityLog::log($opportunity, 'converted', "Oportunidad {$opportunity->folio} convertida a cotización borrador {$quotation->folio}");

        return redirect()->route('admin.quotations.edit', $quotation->id)
            ->with('success', "Cotización {$quotation->folio} creada. Puedes detallar conceptos y precios.");
    }

    public function destroy(Opportunity $opportunity): RedirectResponse
    {
        if ($opportunity->quotations()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar la oportunidad porque tiene cotizaciones asociadas.');
        }

        try {
            $opportunity->delete();

            return redirect()->back()->with('success', 'Oportunidad eliminada');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->back()->with('error', 'No se puede eliminar la oportunidad porque tiene registros asociados.');
        }
    }
}
