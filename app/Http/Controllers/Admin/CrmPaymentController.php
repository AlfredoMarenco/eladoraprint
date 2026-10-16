<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivityLog;
use App\Models\CrmCustomerPayment;
use App\Models\CrmOrder;
use App\Services\CrmWorkflowService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CrmPaymentController extends Controller
{
    public function __construct(
        protected CrmWorkflowService $workflowService
    ) {}

    public function store(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'payment_date' => 'required|date',
            'concept' => 'required|in:anticipo,pago_parcial,liquidacion,ajuste',
            'payment_method' => 'required|string',
            'reference' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $amount = (float) $validated['amount'];

        // Protection against overpayment if desired or informational warning
        $folio = $this->workflowService->generateFolio('payment');

        DB::transaction(function () use ($crmOrder, $validated, $amount, $folio) {
            $payment = CrmCustomerPayment::create([
                'folio' => $folio,
                'order_id' => $crmOrder->id,
                'client_id' => $crmOrder->client_id,
                'payment_date' => $validated['payment_date'],
                'amount' => $amount,
                'concept' => $validated['concept'],
                'payment_method' => $validated['payment_method'],
                'reference' => $validated['reference'] ?? null,
                'notes' => $validated['notes'] ?? null,
                'registered_by' => auth()->id() ?? 1,
                'is_reversal' => false,
            ]);

            CrmActivityLog::log(
                $crmOrder,
                'payment_registered',
                "Pago de cliente {$payment->folio} registrado por $".number_format($amount, 2)." ({$payment->concept})",
                ['folio' => $payment->folio, 'amount' => $amount, 'concept' => $payment->concept]
            );
        });

        return redirect()->back()->with('success', 'Pago de $'.number_format($amount, 2).' registrado correctamente');
    }

    /**
     * Reverse a customer payment with full auditability (no silent deletion).
     */
    public function reverse(Request $request, CrmCustomerPayment $crmCustomerPayment): RedirectResponse
    {
        $validated = $request->validate([
            'reason' => 'required|string|min:5',
        ]);

        if ($crmCustomerPayment->is_reversal) {
            return redirect()->back()->with('error', 'No se puede revertir un movimiento de reversión.');
        }

        $order = $crmCustomerPayment->order;
        $reversalFolio = 'REV-'.$crmCustomerPayment->folio;

        DB::transaction(function () use ($crmCustomerPayment, $order, $validated, $reversalFolio) {
            $reversal = CrmCustomerPayment::create([
                'folio' => $reversalFolio,
                'order_id' => $crmCustomerPayment->order_id,
                'client_id' => $crmCustomerPayment->client_id,
                'payment_date' => now()->toDateString(),
                'amount' => $crmCustomerPayment->amount,
                'concept' => $crmCustomerPayment->concept,
                'payment_method' => $crmCustomerPayment->payment_method,
                'reference' => 'Reversión de '.$crmCustomerPayment->folio,
                'notes' => 'Motivo de reversión: '.$validated['reason'],
                'registered_by' => auth()->id() ?? 1,
                'is_reversal' => true,
                'reversed_payment_id' => $crmCustomerPayment->id,
            ]);

            CrmActivityLog::log(
                $order,
                'payment_reversed',
                "Pago {$crmCustomerPayment->folio} revertido por $".number_format($crmCustomerPayment->amount, 2).". Motivo: {$validated['reason']}",
                ['original_folio' => $crmCustomerPayment->folio, 'reversal_folio' => $reversal->folio]
            );
        });

        return redirect()->back()->with('success', "Pago {$crmCustomerPayment->folio} revertido exitosamente");
    }
}
