<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;

// Public Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/portfolio', [PublicController::class, 'portfolio'])->name('portfolio.index');
Route::get('/portfolio/{slug}', [PublicController::class, 'project'])->name('portfolio.show');
Route::get('/blog', [PublicController::class, 'blog'])->name('blog.index');
Route::get('/blog/{slug}', [PublicController::class, 'post'])->name('blog.show');
Route::get('/about', [PublicController::class, 'about'])->name('about');



require __DIR__.'/settings.php';
