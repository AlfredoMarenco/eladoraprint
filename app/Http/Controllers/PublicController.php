<?php

namespace App\Http\Controllers;

use App\Models\Page;
use App\Models\Post;
use App\Models\Project;
use Inertia\Inertia;

class PublicController extends Controller
{
    public function home()
    {
        $page = Page::where('slug', 'home')
            ->where('is_published', true)
            ->first();

        // Si por alguna razón no se ha migrado la página home, cargamos una vacía
        if (! $page) {
            $page = clone new Page;
            $page->title = 'Inicio';
            $page->content = [];
        }

        return Inertia::render('public/home', [
            'page' => $page,
        ]);
    }

    public function portfolio()
    {
        $projects = Project::with('category')
            ->where('is_published', true)
            ->latest()
            ->paginate(12);

        return Inertia::render('public/portfolio/index', [
            'projects' => $projects,
        ]);
    }

    public function project($slug)
    {
        $project = Project::with(['category', 'images', 'tags'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('public/portfolio/show', [
            'project' => $project,
        ]);
    }

    public function blog()
    {
        $posts = Post::where('is_published', true)
            ->latest('published_at')
            ->paginate(9);

        return Inertia::render('public/blog/index', [
            'posts' => $posts,
        ]);
    }

    public function post($slug)
    {
        $post = Post::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('public/blog/show', [
            'post' => $post,
        ]);
    }

    public function about()
    {
        return Inertia::render('public/about');
    }

    public function page($slug)
    {
        $page = Page::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();

        return Inertia::render('public/page', [
            'page' => $page,
        ]);
    }
}
