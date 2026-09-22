<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\ImageUploadService;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::latest()->paginate(10);
        return Inertia::render('admin/posts/index', [
            'posts' => $posts
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/posts/create');
    }

    public function store(Request $request, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['published_at'] = $validated['is_published'] ? now() : null;

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $imageService->handleUpload($request->file('cover_image'), 'posts');
        }

        Post::create($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Artículo creado exitosamente.');
    }

    public function edit(Post $post)
    {
        return Inertia::render('admin/posts/edit', [
            'post' => $post
        ]);
    }

    public function update(Request $request, Post $post, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'is_published' => 'boolean',
            'cover_image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        
        if ($validated['is_published'] && !$post->is_published) {
            $validated['published_at'] = now();
        } elseif (!$validated['is_published']) {
            $validated['published_at'] = null;
        }

        if ($request->hasFile('cover_image')) {
            $validated['cover_image'] = $imageService->handleUpload($request->file('cover_image'), 'posts');
        } else {
            unset($validated['cover_image']);
        }

        $post->update($validated);

        return redirect()->route('admin.posts.index')->with('success', 'Artículo actualizado exitosamente.');
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return redirect()->route('admin.posts.index')->with('success', 'Artículo eliminado.');
    }
}
