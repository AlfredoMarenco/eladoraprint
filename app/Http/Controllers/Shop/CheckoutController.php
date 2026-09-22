<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Str;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\MercadoPagoConfig;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use MercadoPago\Exceptions\MPApiException;

class CheckoutController extends Controller
{
    public function index()
    {
        return Inertia::render('public/shop/checkout');
    }

    public function process(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string|max:255',
            'shipping_state' => 'required|string|max:255',
            'shipping_zip' => 'required|string|max:20',
            'shipping_cost' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric'
        ]);

        // Calculate total to ensure integrity
        $total = $validated['shipping_cost'];
        foreach ($validated['items'] as $item) {
            $total += $item['price'] * $item['quantity'];
        }

        // Create Order
        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(10)),
            'user_id' => auth()->id(), // null if guest
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['shipping_address'],
            'shipping_city' => $validated['shipping_city'],
            'shipping_state' => $validated['shipping_state'],
            'shipping_zip' => $validated['shipping_zip'],
            'shipping_cost' => $validated['shipping_cost'],
            'total_amount' => $total,
            'status' => 'pending',
            'payment_method' => 'mercadopago',
            'payment_status' => 'pending'
        ]);

        // Create Order Items
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['price'],
                'subtotal' => $item['price'] * $item['quantity'],
            ]);
        }

        // AQUI: Integración con MercadoPago (pendiente SDK)
        try {
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));
            
            $mpItems = [];
            foreach ($validated['items'] as $item) {
                $mpItems[] = [
                    "id" => $item['product_id'],
                    "title" => Product::find($item['product_id'])->name ?? 'Producto',
                    "quantity" => $item['quantity'],
                    "unit_price" => (float) $item['price']
                ];
            }

            // Añadir costo de envío si existe
            if ($validated['shipping_cost'] > 0) {
                $mpItems[] = [
                    "id" => "shipping",
                    "title" => "Costo de Envío",
                    "quantity" => 1,
                    "unit_price" => (float) $validated['shipping_cost']
                ];
            }

            $client = new PreferenceClient();
            $preference = $client->create([
                "items" => $mpItems,
                "payer" => [
                    "name" => $validated['customer_name'],
                    "email" => $validated['customer_email'],
                ],
                "back_urls" => [
                    "success" => route('checkout.success', ['order' => $order->order_number]),
                    "failure" => route('checkout.index'),
                    "pending" => route('checkout.index')
                ],
                "auto_return" => "approved",
                "external_reference" => $order->order_number,
            ]);

            return Inertia::location($preference->init_point);
            
        } catch (\Exception $e) {
            \Log::error('Error MercadoPago: ' . $e->getMessage());
            // Si falla MP, redirigimos a success con pago pendiente por transferencia (fallback)
            return redirect()->route('checkout.success', ['order' => $order->order_number])
                ->with('warning', 'No se pudo conectar con MercadoPago. Podrás pagar después.');
        }
    }

    public function success(Request $request, $orderNumber)
    {
        $order = Order::with('items.product')->where('order_number', $orderNumber)->firstOrFail();
        
        // If MercadoPago redirects here with collection_status = approved
        if ($request->has('collection_status') && $request->collection_status === 'approved') {
            if ($order->payment_status !== 'paid') {
                $order->update([
                    'payment_status' => 'paid',
                    'status' => 'processing'
                ]);

                // Send email
                try {
                    Mail::to($order->customer_email)
                        ->bcc(config('mail.from.address')) // Send copy to admin
                        ->send(new OrderConfirmation($order));
                } catch (\Exception $e) {
                    \Log::error('Error sending confirmation email: ' . $e->getMessage());
                }
            }
        }

        return Inertia::render('public/shop/success', [
            'order' => $order
        ]);
    }
}
