<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Project;
use App\Models\Post;
use App\Models\Service;
use App\Models\Testimonial;

class PublicController extends Controller
{
    public function home()
    {
        $featuredProjects = Project::with('category')
            ->where('is_published', true)
            ->latest()
            ->take(6)
            ->get();
            
        $services = Service::latest()->take(3)->get();
        $testimonials = Testimonial::where('is_active', true)->latest()->take(3)->get();
        
        return Inertia::render('public/home', [
            'featuredProjects' => $featuredProjects,
            'services' => $services,
            'testimonials' => $testimonials
        ]);
    }

    public function portfolio()
    {
        $projects = Project::with('category')
            ->where('is_published', true)
            ->latest()
            ->paginate(12);
            
        return Inertia::render('public/portfolio/index', [
            'projects' => $projects
        ]);
    }

    public function project($slug)
    {
        $project = Project::with(['category', 'images', 'tags'])
            ->where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
            
        return Inertia::render('public/portfolio/show', [
            'project' => $project
        ]);
    }

    public function blog()
    {
        $posts = Post::where('is_published', true)
            ->latest('published_at')
            ->paginate(9);
            
        return Inertia::render('public/blog/index', [
            'posts' => $posts
        ]);
    }

    public function post($slug)
    {
        $post = Post::where('slug', $slug)
            ->where('is_published', true)
            ->firstOrFail();
            
        return Inertia::render('public/blog/show', [
            'post' => $post
        ]);
    }

    public function about()
    {
        return Inertia::render('public/about');
    }
}
