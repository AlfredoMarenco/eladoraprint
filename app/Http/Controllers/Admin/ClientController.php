<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\CrmActivityLog;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status', 'active');
        $type = $request->query('type');

        $query = Client::query();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($type) {
            $query->where('client_type', $type);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('business_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $clients = $query->withCount(['orders', 'quotations'])
            ->with(['payments' => fn ($q) => $q->where('is_reversal', false)])
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/crm/clients/index', [
            'clients' => $clients,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'type' => $type,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/crm/clients/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'client_type' => 'required|string|in:direct,business,agency,event',
            'channel' => 'required|string|in:whatsapp,instagram,referral,website,event,other',
            'first_contact_at' => 'nullable|date',
            'internal_notes' => 'nullable|string',
        ]);

        $client = Client::create([
            ...$validated,
            'first_contact_at' => $validated['first_contact_at'] ?? now()->toDateString(),
            'status' => 'active',
        ]);

        CrmActivityLog::log($client, 'created', "Cliente {$client->name} registrado exitosamente");

        return redirect()->route('admin.clients.show', $client->id)
            ->with('success', 'Cliente registrado correctamente');
    }

    public function show(Client $client): Response
    {
        $client->load([
            'opportunities.assignedUser',
            'quotations' => fn ($q) => $q->latest(),
            'orders' => fn ($q) => $q->with(['tasks', 'payments'])->latest(),
            'payments.order',
        ]);

        return Inertia::render('admin/crm/clients/show', [
            'client' => $client,
            'total_paid' => (float) ($client->total_paid ?? 0),
            'total_balance_due' => (float) ($client->total_balance_due ?? 0),
        ]);
    }

    public function edit(Client $client): Response
    {
        return Inertia::render('admin/crm/clients/edit', [
            'client' => $client,
        ]);
    }

    public function update(Request $request, Client $client): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'business_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'client_type' => 'required|string|in:direct,business,agency,event',
            'channel' => 'required|string|in:whatsapp,instagram,referral,website,event,other',
            'status' => 'required|string|in:active,archived',
            'internal_notes' => 'nullable|string',
        ]);

        $client->update($validated);

        CrmActivityLog::log($client, 'updated', "Ficha de cliente {$client->name} actualizada");

        return redirect()->route('admin.clients.show', $client->id)
            ->with('success', 'Cliente actualizado correctamente');
    }

    public function destroy(Client $client): RedirectResponse
    {
        if ($client->orders()->exists() || $client->quotations()->exists() || $client->opportunities()->exists() || $client->payments()->exists()) {
            return redirect()->back()->with('error', 'No se puede eliminar el cliente porque tiene cotizaciones, pedidos, pagos u oportunidades asociadas.');
        }

        try {
            $client->delete();

            return redirect()->route('admin.clients.index')
                ->with('success', 'Cliente eliminado correctamente.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->back()->with('error', 'No se puede eliminar el cliente porque tiene información vinculada.');
        }
    }
}
