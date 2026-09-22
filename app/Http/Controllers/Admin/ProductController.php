<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Services\ImageUploadService;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('images')->latest()->paginate(10);
        return Inertia::render('admin/products/index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/products/create');
    }

    public function store(Request $request, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'type' => 'required|in:physical,digital,service',
            'is_active' => 'boolean',
            'stock' => 'nullable|integer|min:0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product = Product::create($validated);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $imageService->handleUpload($image, 'products');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $index === 0,
                    'order' => $index
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Producto creado exitosamente.');
    }

    public function edit(Product $product)
    {
        $product->load(['images', 'variations']);
        return Inertia::render('admin/products/edit', [
            'product' => $product
        ]);
    }

    public function update(Request $request, Product $product, ImageUploadService $imageService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'type' => 'required|in:physical,digital,service',
            'is_active' => 'boolean',
            'stock' => 'nullable|integer|min:0',
            'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $product->update($validated);

        if ($request->hasFile('images')) {
            $lastOrder = $product->images()->max('order') ?? 0;
            foreach ($request->file('images') as $index => $image) {
                $path = $imageService->handleUpload($image, 'products');
                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => false,
                    'order' => $lastOrder + 1 + $index
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Producto actualizado exitosamente.');
    }

    public function destroy(Product $product)
    {
        try {
            $product->delete();
            return redirect()->route('admin.products.index')->with('success', 'Producto eliminado.');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return redirect()->route('admin.products.index')->with('error', 'El producto no se puede eliminar porque tiene otros elementos asociados (como órdenes).');
            }
            throw $e;
        }
    }
}
