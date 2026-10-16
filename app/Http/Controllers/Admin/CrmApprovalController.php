<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivityLog;
use App\Models\CrmOrder;
use App\Models\CrmOrderApproval;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CrmApprovalController extends Controller
{
    public function store(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'version_title' => 'required|string|max:255',
            'review_type' => 'required|string',
            'deadline_at' => 'nullable|date',
            'external_url' => 'nullable|url',
            'status' => 'required|in:draft,sent,changes_requested,approved,rejected',
        ]);

        $approval = CrmOrderApproval::create([
            ...$validated,
            'order_id' => $crmOrder->id,
            'sent_at' => $validated['status'] === 'sent' ? now() : null,
            'created_by' => auth()->id(),
        ]);

        CrmActivityLog::log($crmOrder, 'approval_created', "Revisión '{$approval->version_title}' registrada para el pedido {$crmOrder->folio}");

        return redirect()->back()->with('success', 'Revisión registrada exitosamente');
    }

    public function update(Request $request, CrmOrderApproval $crmApproval): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,sent,changes_requested,approved,rejected,superseded',
            'client_feedback' => 'nullable|string',
            'approved_by_name' => 'nullable|string',
            'evidence_notes' => 'nullable|string',
        ]);

        $updates = [
            'status' => $validated['status'],
            'client_feedback' => $validated['client_feedback'] ?? null,
            'approved_by_name' => $validated['approved_by_name'] ?? null,
            'evidence_notes' => $validated['evidence_notes'] ?? null,
            'responded_at' => now(),
        ];

        $crmApproval->update($updates);

        CrmActivityLog::log(
            $crmApproval->order,
            'approval_updated',
            "Revisión '{$crmApproval->version_title}' marcada como '{$validated['status']}'".($validated['approved_by_name'] ? " por {$validated['approved_by_name']}" : '')
        );

        return redirect()->back()->with('success', 'Resultado de revisión registrado correctamente');
    }

    public function destroy(CrmOrderApproval $crmApproval): RedirectResponse
    {
        $crmApproval->delete();

        return redirect()->back()->with('success', 'Revisión eliminada');
    }
}
