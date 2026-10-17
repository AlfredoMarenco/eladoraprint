<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BusinessSetting;
use App\Models\Client;
use App\Models\CrmActivityLog;
use App\Models\Quotation;
use App\Services\CrmWorkflowService;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class QuotationController extends Controller
{
    public function __construct(
        protected CrmWorkflowService $workflowService
    ) {}

    public function index(Request $request): Response
    {
        $universe = $request->query('universe', 'all');
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Quotation::with(['client', 'convertedOrder']);

        if ($universe !== 'all') {
            $query->where('universe', $universe);
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('folio', 'like', "%{$search}%")
                    ->orWhere('project_name', 'like', "%{$search}%")
                    ->orWhereHas('client', fn ($cq) => $cq->where('name', 'like', "%{$search}%"));
            });
        }

        $quotations = $query->latest('creation_date')->latest('id')->paginate(15)->withQueryString();

        return Inertia::render('admin/crm/quotations/index', [
            'quotations' => $quotations,
            'filters' => [
                'universe' => $universe,
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        $clients = Client::where('status', 'active')->orderBy('name')->get(['id', 'name', 'business_name', 'phone', 'email']);
        $clientId = $request->query('client_id');

        return Inertia::render('admin/crm/quotations/create', [
            'clients' => $clients,
            'selected_client_id' => $clientId ? (int) $clientId : null,
            'default_advance_percent' => (float) BusinessSetting::get('default_advance_percent', 50),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'universe' => 'required|in:print,studio,moments',
            'project_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.concept' => 'required|string',
            'items.*.description' => 'nullable|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'advance_required' => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string',
            'estimated_delivery_time' => 'nullable|string',
            'expiration_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $subtotal = collect($validated['items'])->sum(fn ($i) => (float) $i['subtotal']);
        $discount = (float) ($validated['discount'] ?? 0);
        $total = max(0, $subtotal - $discount);
        $advance = isset($validated['advance_required']) ? (float) $validated['advance_required'] : round($total * 0.5, 2);

        $folio = $this->workflowService->generateFolio('quotation', $validated['universe']);

        $quotation = Quotation::create([
            'folio' => $folio,
            'client_id' => $validated['client_id'],
            'universe' => $validated['universe'],
            'project_name' => $validated['project_name'],
            'description' => $validated['description'] ?? null,
            'items' => $validated['items'],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total_amount' => $total,
            'advance_required' => $advance,
            'payment_terms' => $validated['payment_terms'] ?? '50% de anticipo para iniciar, 50% restante contra entrega.',
            'estimated_delivery_time' => $validated['estimated_delivery_time'] ?? null,
            'creation_date' => now()->toDateString(),
            'expiration_date' => $validated['expiration_date'] ?? now()->addDays(15)->toDateString(),
            'status' => 'draft',
            'version' => 1,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Save initial snapshot
        $quotation->createSnapshot(auth()->id(), 'Creación de cotización');

        CrmActivityLog::log($quotation, 'created', "Cotización {$quotation->folio} creada por un total de $".number_format($quotation->total_amount, 2));

        return redirect()->route('admin.quotations.show', $quotation->id)
            ->with('success', "Cotización {$quotation->folio} guardada exitosamente");
    }

    public function show(Quotation $quotation): Response
    {
        $quotation->load(['client', 'opportunity', 'convertedOrder', 'versions.createdBy']);

        return Inertia::render('admin/crm/quotations/show', [
            'quotation' => $quotation,
            'company_info' => $this->getCompanyInfo(),
        ]);
    }

    public function edit(Quotation $quotation): Response
    {
        if ($quotation->converted_to_order_id) {
            return redirect()->route('admin.quotations.show', $quotation->id)
                ->with('error', 'Esta cotización ya fue convertida a pedido y su versión aceptada está bloqueada para preservar trazabilidad.');
        }

        $clients = Client::where('status', 'active')->orderBy('name')->get(['id', 'name', 'business_name']);

        return Inertia::render('admin/crm/quotations/edit', [
            'quotation' => $quotation,
            'clients' => $clients,
        ]);
    }

    public function update(Request $request, Quotation $quotation): RedirectResponse
    {
        if ($quotation->converted_to_order_id) {
            return redirect()->back()->with('error', 'No se puede editar una cotización ya convertida a pedido.');
        }

        $validated = $request->validate([
            'project_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.concept' => 'required|string',
            'items.*.description' => 'nullable|string',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'advance_required' => 'nullable|numeric|min:0',
            'payment_terms' => 'nullable|string',
            'estimated_delivery_time' => 'nullable|string',
            'expiration_date' => 'nullable|date',
            'status' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $subtotal = collect($validated['items'])->sum(fn ($i) => (float) $i['subtotal']);
        $discount = (float) ($validated['discount'] ?? 0);
        $total = max(0, $subtotal - $discount);
        $advance = isset($validated['advance_required']) ? (float) $validated['advance_required'] : round($total * 0.5, 2);

        // Snapshot existing version if total or status changed
        $quotation->createSnapshot(auth()->id(), 'Actualización a versión '.($quotation->version + 1));

        $quotation->update([
            'project_name' => $validated['project_name'],
            'description' => $validated['description'] ?? null,
            'items' => $validated['items'],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total_amount' => $total,
            'advance_required' => $advance,
            'payment_terms' => $validated['payment_terms'],
            'estimated_delivery_time' => $validated['estimated_delivery_time'],
            'expiration_date' => $validated['expiration_date'],
            'status' => $validated['status'],
            'version' => $quotation->version + 1,
            'notes' => $validated['notes'],
        ]);

        CrmActivityLog::log($quotation, 'updated', "Cotización {$quotation->folio} actualizada a versión {$quotation->version}");

        return redirect()->route('admin.quotations.show', $quotation->id)
            ->with('success', 'Cotización actualizada y versión registrada');
    }

    public function updateStatus(Request $request, Quotation $quotation): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,preparing,sent,in_followup,accepted,rejected,expired,cancelled',
        ]);

        $newStatus = $validated['status'];
        $oldStatus = $quotation->status;

        $updates = ['status' => $newStatus];
        if ($newStatus === 'sent' && ! $quotation->sent_date) {
            $updates['sent_date'] = now()->toDateString();
        }
        if ($newStatus === 'accepted' && ! $quotation->accepted_date) {
            $updates['accepted_date'] = now()->toDateString();
        }

        $quotation->update($updates);

        CrmActivityLog::log($quotation, 'status_changed', "Estado de cotización {$quotation->folio} modificado de {$oldStatus} a {$newStatus}");

        return redirect()->back()->with('success', "Estado actualizado a '{$newStatus}'");
    }

    public function convertToOrder(Quotation $quotation): RedirectResponse
    {
        try {
            $order = $this->workflowService->convertQuotationToOrder($quotation, auth()->id());

            return redirect()->route('admin.crm-orders.show', $order->id)
                ->with('success', "¡Cotización {$quotation->folio} convertida exitosamente en el pedido {$order->folio}!");
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function duplicate(Quotation $quotation): RedirectResponse
    {
        $newFolio = $this->workflowService->generateFolio('quotation', $quotation->universe);

        $newQuote = Quotation::create([
            'folio' => $newFolio,
            'client_id' => $quotation->client_id,
            'opportunity_id' => $quotation->opportunity_id,
            'universe' => $quotation->universe,
            'project_name' => $quotation->project_name.' (Copia)',
            'description' => $quotation->description,
            'items' => $quotation->items,
            'subtotal' => $quotation->subtotal,
            'discount' => $quotation->discount,
            'total_amount' => $quotation->total_amount,
            'advance_required' => $quotation->advance_required,
            'payment_terms' => $quotation->payment_terms,
            'estimated_delivery_time' => $quotation->estimated_delivery_time,
            'creation_date' => now()->toDateString(),
            'expiration_date' => now()->addDays(15)->toDateString(),
            'status' => 'draft',
            'version' => 1,
            'notes' => 'Duplicado de '.$quotation->folio,
        ]);

        CrmActivityLog::log($newQuote, 'created', "Cotización {$newQuote->folio} creada duplicando {$quotation->folio}");

        return redirect()->route('admin.quotations.show', $newQuote->id)
            ->with('success', "Cotización duplicada con folio {$newQuote->folio}");
    }

    public function destroy(Quotation $quotation): RedirectResponse
    {
        if ($quotation->converted_to_order_id || \App\Models\CrmOrder::where('quotation_id', $quotation->id)->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar una cotización que ya fue convertida a pedido o tiene un pedido asociado.');
        }

        try {
            $quotation->delete();

            return redirect()->route('admin.quotations.index')->with('success', 'Cotización eliminada');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->back()->with('error', 'No se puede eliminar la cotización porque tiene información relacionada.');
        }
    }

    public function downloadPdf(Quotation $quotation): HttpResponse
    {
        $quotation->load(['client', 'opportunity', 'convertedOrder']);

        $logoBase64 = null;
        if (file_exists(public_path('images/logo.png'))) {
            $logoBase64 = 'data:image/png;base64,'.base64_encode((string) file_get_contents(public_path('images/logo.png')));
        }

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'company_info' => $this->getCompanyInfo(),
            'logo' => $logoBase64,
        ])->setPaper('letter', 'portrait');

        return $pdf->download("Cotizacion-{$quotation->folio}.pdf");
    }

    public function previewPdf(Quotation $quotation): HttpResponse
    {
        $quotation->load(['client', 'opportunity', 'convertedOrder']);

        $logoBase64 = null;
        if (file_exists(public_path('images/logo.png'))) {
            $logoBase64 = 'data:image/png;base64,'.base64_encode((string) file_get_contents(public_path('images/logo.png')));
        }

        $pdf = Pdf::loadView('pdf.quotation', [
            'quotation' => $quotation,
            'company_info' => $this->getCompanyInfo(),
            'logo' => $logoBase64,
        ])->setPaper('letter', 'portrait');

        return $pdf->stream("Cotizacion-{$quotation->folio}.pdf");
    }

    /**
     * @return array<string, mixed>
     */
    protected function getCompanyInfo(): array
    {
        return [
            'name' => BusinessSetting::get('company_name', 'Eladora'),
            'email' => BusinessSetting::get('company_email', 'contacto@eladora.mx'),
            'phone' => BusinessSetting::get('company_phone', '+52 55 4912 3847'),
            'currency' => BusinessSetting::get('default_currency', 'MXN'),
            'website' => BusinessSetting::get('company_website', 'www.eladora.mx'),
            'address' => BusinessSetting::get('company_address', 'Ciudad de México, México'),
            'bank_name' => BusinessSetting::get('bank_name', 'BBVA México'),
            'bank_account' => BusinessSetting::get('bank_account', '0123 4567 89'),
            'bank_clabe' => BusinessSetting::get('bank_clabe', '012 180 00123456789 0'),
            'bank_beneficiary' => BusinessSetting::get('bank_beneficiary', 'Eladora Impresión & Diseño'),
        ];
    }
}
