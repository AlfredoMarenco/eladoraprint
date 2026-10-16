<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\CrmSimulationCostItem;
use App\Models\CrmSimulationScenario;
use App\Models\Quotation;
use App\Services\CrmWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmSimulationController extends Controller
{
    public function __construct(
        protected CrmWorkflowService $workflowService
    ) {}

    public function index(): Response
    {
        $scenarios = CrmSimulationScenario::with('costItems')
            ->latest()
            ->get();

        $clients = Client::where('status', 'active')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/crm/simulations/index', [
            'scenarios' => $scenarios,
            'clients' => $clients,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'universe' => 'required|in:print,studio,moments',
            'service_type' => 'nullable|string|max:255',
            'quantity' => 'required|integer|min:1',
            'proposed_sale_price' => 'required|numeric|min:0',
            'workshop_overhead_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'cost_items' => 'nullable|array',
            'cost_items.*.category' => 'required|string',
            'cost_items.*.concept' => 'required|string',
            'cost_items.*.amount' => 'required|numeric|min:0',
        ]);

        $scenario = CrmSimulationScenario::create([
            'name' => $validated['name'],
            'universe' => $validated['universe'],
            'service_type' => $validated['service_type'] ?? null,
            'quantity' => $validated['quantity'],
            'proposed_sale_price' => $validated['proposed_sale_price'],
            'workshop_overhead_amount' => $validated['workshop_overhead_amount'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'created_by' => auth()->id(),
        ]);

        if (! empty($validated['cost_items'])) {
            foreach ($validated['cost_items'] as $item) {
                CrmSimulationCostItem::create([
                    'scenario_id' => $scenario->id,
                    'category' => $item['category'],
                    'concept' => $item['concept'],
                    'amount' => $item['amount'],
                ]);
            }
        }

        return redirect()->back()->with('success', 'Escenario de simulación guardado');
    }

    public function duplicate(CrmSimulationScenario $crmSimulationScenario): RedirectResponse
    {
        $copy = $crmSimulationScenario->replicate([
            'created_at',
            'updated_at',
        ]);
        $copy->name = $crmSimulationScenario->name.' (Copia)';
        $copy->save();

        foreach ($crmSimulationScenario->costItems as $item) {
            $copy->costItems()->create([
                'category' => $item->category,
                'concept' => $item->concept,
                'amount' => $item->amount,
            ]);
        }

        return redirect()->back()->with('success', "Escenario duplicado como '{$copy->name}'");
    }

    public function convertToQuotation(Request $request, CrmSimulationScenario $crmSimulationScenario): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
        ]);

        $folio = $this->workflowService->generateFolio('quotation', $crmSimulationScenario->universe);

        $quotation = Quotation::create([
            'folio' => $folio,
            'client_id' => $validated['client_id'],
            'universe' => $crmSimulationScenario->universe,
            'project_name' => $crmSimulationScenario->name,
            'description' => "Generado a partir del escenario de simulación: {$crmSimulationScenario->name}. Cantidad: {$crmSimulationScenario->quantity} unidades.",
            'items' => [
                [
                    'concept' => $crmSimulationScenario->service_type ?? $crmSimulationScenario->name,
                    'description' => "Producción de {$crmSimulationScenario->quantity} unidades con acabados seleccionados",
                    'quantity' => $crmSimulationScenario->quantity,
                    'unit_price' => round($crmSimulationScenario->proposed_sale_price / max(1, $crmSimulationScenario->quantity), 2),
                    'subtotal' => $crmSimulationScenario->proposed_sale_price,
                ],
            ],
            'subtotal' => $crmSimulationScenario->proposed_sale_price,
            'discount' => 0,
            'total_amount' => $crmSimulationScenario->proposed_sale_price,
            'advance_required' => round($crmSimulationScenario->proposed_sale_price * 0.5, 2),
            'creation_date' => now()->toDateString(),
            'expiration_date' => now()->addDays(15)->toDateString(),
            'status' => 'draft',
            'version' => 1,
            'notes' => $crmSimulationScenario->notes,
        ]);

        return redirect()->route('admin.quotations.edit', $quotation->id)
            ->with('success', "Cotización borrador {$quotation->folio} creada a partir de la simulación");
    }

    public function destroy(CrmSimulationScenario $crmSimulationScenario): RedirectResponse
    {
        $crmSimulationScenario->delete();

        return redirect()->back()->with('success', 'Escenario eliminado');
    }
}
