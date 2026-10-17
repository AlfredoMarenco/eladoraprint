<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\ImageUploadService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::latest('id')->paginate(10);

        return Inertia::render('admin/services/index', [
            'services' => $services,
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/services/create');
    }

    public function store(Request $request, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'integer',
            'icon_path' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
        ]);

        if ($request->hasFile('icon_path')) {
            $validated['icon_path'] = $imageService->handleUpload($request->file('icon_path'), 'services');
        } else {
            unset($validated['icon_path']);
        }

        Service::create($validated);

        return redirect()->route('admin.services.index')->with('success', 'Servicio creado exitosamente.');
    }

    public function edit(Service $service)
    {
        return Inertia::render('admin/services/edit', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Service $service, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'order' => 'integer',
            'icon_path' => 'nullable|image|mimes:jpeg,png,jpg,webp,svg|max:2048',
        ]);

        if ($request->hasFile('icon_path')) {
            $validated['icon_path'] = $imageService->handleUpload($request->file('icon_path'), 'services');
        } else {
            unset($validated['icon_path']);
        }

        $service->update($validated);

        return redirect()->route('admin.services.index')->with('success', 'Servicio actualizado exitosamente.');
    }

    public function destroy(Service $service)
    {
        try {
            if (\App\Models\CrmOrder::where('service_type', $service->title)->exists()) {
                return redirect()->route('admin.services.index')->with('error', 'El servicio no se puede eliminar porque está vinculado a pedidos existentes.');
            }

            $service->delete();

            return redirect()->route('admin.services.index')->with('success', 'Servicio eliminado.');
        } catch (\Illuminate\Database\QueryException $e) {
            return redirect()->route('admin.services.index')->with('error', 'El servicio no se puede eliminar porque tiene información asociada.');
        }
    }
}
