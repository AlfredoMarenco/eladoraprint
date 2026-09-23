<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function index()
    {
        $pages = Page::latest()->paginate(10);
        return Inertia::render('admin/pages/index', [
            'pages' => $pages
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/pages/create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug',
            'seo_description' => 'nullable|string',
            'is_published' => 'boolean',
            'content' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }
        
        if (empty($validated['content'])) {
            $validated['content'] = [];
        }

        Page::create($validated);

        return redirect()->route('admin.pages.index')->with('success', 'Página creada exitosamente.');
    }

    public function edit(Page $page)
    {
        return Inertia::render('admin/pages/edit', [
            'page' => $page
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:pages,slug,' . $page->id,
            'seo_description' => 'nullable|string',
            'is_published' => 'boolean',
            'content' => 'nullable|array',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        } else {
            $validated['slug'] = Str::slug($validated['slug']);
        }
        
        if (empty($validated['content'])) {
            $validated['content'] = [];
        }

        $page->update($validated);

        return redirect()->route('admin.pages.index')->with('success', 'Página actualizada exitosamente.');
    }

    public function destroy(Page $page)
    {
        $page->delete();
        return redirect()->route('admin.pages.index')->with('success', 'Página eliminada.');
    }
}
