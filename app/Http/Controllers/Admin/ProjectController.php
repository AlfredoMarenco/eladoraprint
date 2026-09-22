<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Category;
use App\Models\ProjectImage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\ImageUploadService;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('category')->latest()->paginate(10);
        return Inertia::render('admin/projects/index', [
            'projects' => $projects
        ]);
    }

    public function create()
    {
        $categories = Category::all();
        return Inertia::render('admin/projects/create', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'client' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'project_url' => 'nullable|url',
            'video_url' => 'nullable|url',
            'completion_date' => 'nullable|date',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $imageService->handleUpload($request->file('cover_image'), 'projects');
        }

        $project = Project::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $imageService->handleUpload($image, 'projects/gallery');
                $project->images()->create([
                    'image_path' => $path,
                    'order' => $index
                ]);
            }
        }

        return redirect()->route('admin.projects.index')->with('success', 'Proyecto creado exitosamente.');
    }

    public function edit(Project $project)
    {
        $categories = Category::all();
        $project->load('images');
        return Inertia::render('admin/projects/edit', [
            'project' => $project,
            'categories' => $categories
        ]);
    }

    public function update(Request $request, Project $project, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'client' => 'nullable|string|max:255',
            'role' => 'nullable|string|max:255',
            'project_url' => 'nullable|url',
            'video_url' => 'nullable|url',
            'completion_date' => 'nullable|date',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('cover_image')) {
            // Delete old cover image if necessary (omitted for brevity, can add later)
            $validated['cover_image'] = $imageService->handleUpload($request->file('cover_image'), 'projects');
        }

        $project->update($validated);

        if ($request->hasFile('images')) {
            $lastOrder = $project->images()->max('order') ?? 0;
            foreach ($request->file('images') as $index => $image) {
                $path = $imageService->handleUpload($image, 'projects/gallery');
                $project->images()->create([
                    'image_path' => $path,
                    'order' => $lastOrder + 1 + $index
                ]);
            }
        }

        return redirect()->route('admin.projects.index')->with('success', 'Proyecto actualizado exitosamente.');
    }

    public function destroy(Project $project)
    {
        try {
            $project->delete();
            return redirect()->route('admin.projects.index')->with('success', 'Proyecto eliminado.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return redirect()->route('admin.projects.index')->with('error', 'El proyecto no se puede eliminar porque tiene elementos asociados.');
            }
            throw $e;
        }
    }
}
