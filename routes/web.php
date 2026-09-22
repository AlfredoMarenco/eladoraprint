<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\PostController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\Shop\CheckoutController;
use App\Http\Controllers\Shop\WebhookController;

// Public Routes
Route::get('/', [PublicController::class, 'home'])->name('home');
Route::get('/portfolio', [PublicController::class, 'portfolio'])->name('portfolio.index');
Route::get('/portfolio/{slug}', [PublicController::class, 'project'])->name('portfolio.show');
Route::get('/blog', [PublicController::class, 'blog'])->name('blog.index');
Route::get('/blog/{slug}', [PublicController::class, 'post'])->name('blog.show');
Route::get('/about', [PublicController::class, 'about'])->name('about');

// Shop Routes
Route::get('/shop', [ShopController::class, 'index'])->name('shop.index');
Route::get('/shop/{slug}', [ShopController::class, 'show'])->name('shop.show');

// Checkout Routes
Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout.index');
Route::post('/checkout', [CheckoutController::class, 'process'])->name('checkout.process');
Route::get('/checkout/success/{order}', [CheckoutController::class, 'success'])->name('checkout.success');

// Webhooks
Route::post('/webhooks/mercadopago', [WebhookController::class, 'handleMercadoPago'])->name('webhooks.mercadopago');


require __DIR__.'/settings.php';
