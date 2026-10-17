<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivityLog;
use App\Models\CrmOrder;
use App\Models\CrmPurchase;
use App\Models\CrmSupplier;
use App\Models\CrmSupplierPayment;
use App\Services\CrmWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmPurchaseController extends Controller
{
    public function __construct(
        protected CrmWorkflowService $workflowService
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $supplierId = $request->query('supplier_id');
        $search = $request->query('search');

        $query = CrmPurchase::with(['supplier', 'order', 'payments']);

        if ($status) {
            $query->where('purchase_status', $status);
        }

        if ($supplierId) {
            $query->where('supplier_id', $supplierId);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('folio', 'like', "%{$search}%")
                    ->orWhere('concept', 'like', "%{$search}%")
                    ->orWhereHas('supplier', fn ($sq) => $sq->where('name', 'like', "%{$search}%"));
            });
        }

        $purchases = $query->latest('requested_date')->latest('id')->paginate(15)->withQueryString();
        $suppliers = CrmSupplier::where('status', 'active')->orderBy('name')->get(['id', 'name']);
        $orders = CrmOrder::whereNotIn('operating_status', ['entregado', 'cerrado'])->get(['id', 'folio', 'project_name']);

        return Inertia::render('admin/crm/purchases/index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'orders' => $orders,
            'filters' => [
                'status' => $status,
                'supplier_id' => $supplierId,
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'required|exists:crm_suppliers,id',
            'order_id' => 'nullable|exists:crm_orders,id',
            'concept' => 'required|string|max:255',
            'category' => 'required|string',
            'estimated_amount' => 'required|numeric|min:0',
            'real_amount' => 'nullable|numeric|min:0',
            'requested_date' => 'required|date',
            'expected_delivery_date' => 'nullable|date',
            'payment_due_date' => 'nullable|date',
            'purchase_status' => 'required|string',
            'receipt_notes' => 'nullable|string',
        ]);

        $folio = $this->workflowService->generateFolio('purchase');

        $purchase = CrmPurchase::create([
            ...$validated,
            'folio' => $folio,
        ]);

        if ($purchase->order_id) {
            CrmActivityLog::log(
                $purchase->order,
                'purchase_registered',
                "Compra {$purchase->folio} registrada con {$purchase->supplier->name} por $".number_format($purchase->effective_cost, 2)
            );
        }

        return redirect()->back()->with('success', "Compra {$purchase->folio} registrada exitosamente");
    }

    public function update(Request $request, CrmPurchase $crmPurchase): RedirectResponse
    {
        $validated = $request->validate([
            'supplier_id' => 'sometimes|required|exists:crm_suppliers,id',
            'order_id' => 'nullable|exists:crm_orders,id',
            'concept' => 'required|string|max:255',
            'category' => 'required|string',
            'estimated_amount' => 'required|numeric|min:0',
            'real_amount' => 'nullable|numeric|min:0',
            'requested_date' => 'sometimes|required|date',
            'expected_delivery_date' => 'nullable|date',
            'real_delivery_date' => 'nullable|date',
            'payment_due_date' => 'nullable|date',
            'purchase_status' => 'required|string',
            'receipt_notes' => 'nullable|string',
        ]);

        $crmPurchase->update($validated);

        return redirect()->back()->with('success', 'Compra actualizada');
    }

    /**
     * Record a payment made to the supplier for this purchase.
     */
    public function registerPayment(Request $request, CrmPurchase $crmPurchase): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $amount = (float) $validated['amount'];
        $folio = 'PAGP-'.date('Y').'-'.sprintf('%04d', CrmSupplierPayment::whereYear('created_at', date('Y'))->count() + 1);

        CrmSupplierPayment::create([
            'folio' => $folio,
            'purchase_id' => $crmPurchase->id,
            'supplier_id' => $crmPurchase->supplier_id,
            'payment_date' => $validated['payment_date'],
            'amount' => $amount,
            'payment_method' => $validated['payment_method'],
            'reference' => $validated['reference'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'registered_by' => auth()->id() ?? 1,
        ]);

        return redirect()->back()->with('success', 'Pago a proveedor por $'.number_format($amount, 2).' registrado');
    }

    public function destroy(CrmPurchase $crmPurchase): RedirectResponse
    {
        if ($crmPurchase->payments()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar la compra porque tiene pagos registrados a proveedores.');
        }

        try {
            $crmPurchase->delete();

            return redirect()->back()->with('success', 'Compra eliminada');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->back()->with('error', 'No se puede eliminar la compra porque tiene registros vinculados.');
        }
    }
}
