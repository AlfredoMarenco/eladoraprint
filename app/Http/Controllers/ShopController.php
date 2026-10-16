<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        // Solo mostramos productos activos
        $products = Product::with('images')
            ->where('is_active', true)
            ->latest()
            ->paginate(12);

        return Inertia::render('public/shop/index', [
            'products' => $products,
        ]);
    }

    public function show($slug)
    {
        $product = Product::with(['images', 'variations'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Obtener productos relacionados (del mismo tipo)
        $relatedProducts = Product::with('images')
            ->where('is_active', true)
            ->where('type', $product->type)
            ->where('id', '!=', $product->id)
            ->take(4)
            ->get();

        return Inertia::render('public/shop/show', [
            'product' => $product,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
