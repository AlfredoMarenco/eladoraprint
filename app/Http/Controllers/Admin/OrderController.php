<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::latest()->paginate(10);
        return Inertia::render('admin/orders/index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $order->load('items.product');
        return Inertia::render('admin/orders/show', [
            'order' => $order
        ]);
    }

    public function update(Request $request, Order $order)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'payment_status' => 'required|in:pending,paid,failed,refunded'
        ]);

        $order->update($validated);

        return back()->with('success', 'Orden actualizada correctamente');
    }

    public function destroy(Order $order)
    {
        try {
            $order->delete();
            return redirect()->route('admin.orders.index')->with('success', 'Orden eliminada');
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                return redirect()->route('admin.orders.index')->with('error', 'La orden no se puede eliminar porque tiene elementos asociados.');
            }
            throw $e;
        }
    }
}
