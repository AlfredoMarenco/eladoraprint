<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CrmSupplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CrmSupplierController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status', 'active');
        $type = $request->query('type', 'all');
        $search = $request->query('search');

        $query = CrmSupplier::query();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($type && $type !== 'all') {
            $query->where('supplier_type', $type);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('website_url', 'like', "%{$search}%");
            });
        }

        $suppliers = $query->withCount('purchases')
            ->with(['purchases' => fn ($q) => $q->with('payments')])
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/crm/suppliers/index', [
            'suppliers' => $suppliers,
            'filters' => [
                'status' => $status,
                'type' => $type,
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_type' => 'nullable|in:traditional,online',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website_url' => 'nullable|string|max:2048',
            'category' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        CrmSupplier::create([
            ...$validated,
            'supplier_type' => $validated['supplier_type'] ?? 'traditional',
            'status' => 'active',
        ]);

        return redirect()->back()->with('success', 'Proveedor registrado exitosamente');
    }

    public function update(Request $request, CrmSupplier $crmSupplier): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'supplier_type' => 'nullable|in:traditional,online',
            'contact_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'website_url' => 'nullable|string|max:2048',
            'category' => 'required|string',
            'status' => 'required|in:active,archived',
            'notes' => 'nullable|string',
        ]);

        $crmSupplier->update([
            ...$validated,
            'supplier_type' => $validated['supplier_type'] ?? $crmSupplier->supplier_type ?? 'traditional',
        ]);

        return redirect()->back()->with('success', 'Proveedor actualizado correctamente');
    }

    public function destroy(CrmSupplier $crmSupplier): RedirectResponse
    {
        if ($crmSupplier->purchases()->exists() || $crmSupplier->payments()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar el proveedor porque tiene compras o pagos registrados asociados.');
        }

        try {
            $crmSupplier->delete();

            return redirect()->back()->with('success', 'Proveedor eliminado.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->back()->with('error', 'No se puede eliminar el proveedor porque tiene información vinculada.');
        }
    }
}
