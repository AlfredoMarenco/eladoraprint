<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmActivityLog;
use App\Models\CrmOrder;
use App\Models\CrmTask;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class CrmTaskController extends Controller
{
    public function store(Request $request, CrmOrder $crmOrder): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'assigned_to' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:low,medium,high,urgent',
            'notes' => 'nullable|string',
        ]);

        $maxOrder = $crmOrder->tasks()->max('order_index') ?? 0;

        $task = CrmTask::create([
            ...$validated,
            'order_id' => $crmOrder->id,
            'order_index' => $maxOrder + 1,
            'status' => 'pending',
        ]);

        CrmActivityLog::log($crmOrder, 'task_created', "Nueva tarea '{$task->title}' añadida al pedido {$crmOrder->folio}");

        return redirect()->back()->with('success', 'Tarea creada exitosamente');
    }

    public function update(Request $request, CrmTask $crmTask): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
            'assigned_to' => 'nullable|exists:users,id',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:pending,in_progress,blocked,completed,cancelled',
            'blocked_reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        if ($validated['status'] === 'completed' && ! $crmTask->completed_at) {
            $validated['completed_at'] = now();
        } elseif ($validated['status'] !== 'completed') {
            $validated['completed_at'] = null;
        }

        $crmTask->update($validated);

        return redirect()->back()->with('success', 'Tarea actualizada');
    }

    public function updateStatus(Request $request, CrmTask $crmTask): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,blocked,completed,cancelled',
            'blocked_reason' => 'nullable|string',
        ]);

        $updates = ['status' => $validated['status']];
        if ($validated['status'] === 'completed') {
            $updates['completed_at'] = now();
            $updates['blocked_reason'] = null;
        } elseif ($validated['status'] === 'blocked') {
            $updates['blocked_reason'] = $validated['blocked_reason'] ?? 'Bloqueado por respuesta o insumo pendiente';
        } else {
            $updates['completed_at'] = null;
            $updates['blocked_reason'] = null;
        }

        $crmTask->update($updates);

        return redirect()->back()->with('success', 'Estado de la tarea modificado');
    }

    public function destroy(CrmTask $crmTask): RedirectResponse
    {
        $crmTask->delete();

        return redirect()->back()->with('success', 'Tarea eliminada');
    }
}
