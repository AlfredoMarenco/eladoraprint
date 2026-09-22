<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\ImageUploadService;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::latest()->paginate(10);
        return Inertia::render('admin/testimonials/index', [
            'testimonials' => $testimonials
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/testimonials/create');
    }

    public function store(Request $request, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string',
            'is_active' => 'boolean',
            'avatar_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('avatar_image')) {
            $validated['avatar_image'] = $imageService->handleUpload($request->file('avatar_image'), 'testimonials');
        }

        Testimonial::create($validated);

        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonio creado exitosamente.');
    }

    public function edit(Testimonial $testimonial)
    {
        return Inertia::render('admin/testimonials/edit', [
            'testimonial' => $testimonial
        ]);
    }

    public function update(Request $request, Testimonial $testimonial, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'company' => 'nullable|string|max:255',
            'content' => 'required|string',
            'is_active' => 'boolean',
            'avatar_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        if ($request->hasFile('avatar_image')) {
            $validated['avatar_image'] = $imageService->handleUpload($request->file('avatar_image'), 'testimonials');
        } else {
            unset($validated['avatar_image']);
        }

        $testimonial->update($validated);

        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonio actualizado exitosamente.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return redirect()->route('admin.testimonials.index')->with('success', 'Testimonio eliminado.');
    }
}
