<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ImageUploadService;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::orderBy('order')->paginate(10);
        return Inertia::render('admin/services/index', [
            'services' => $services
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
            'service' => $service
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
        $service->delete();
        return redirect()->route('admin.services.index')->with('success', 'Servicio eliminado.');
    }
}
