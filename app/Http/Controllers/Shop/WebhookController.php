<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Payment\PaymentClient;
use Illuminate\Support\Facades\Log;

class WebhookController extends Controller
{
    public function handleMercadoPago(Request $request)
    {
        Log::info('Webhook MercadoPago recibido', $request->all());

        try {
            MercadoPagoConfig::setAccessToken(config('services.mercadopago.access_token'));

            $topic = $request->query('topic') ?? $request->input('type');
            
            if ($topic === 'payment') {
                $paymentId = $request->query('id') ?? $request->input('data.id');
                
                if ($paymentId) {
                    $client = new PaymentClient();
                    $payment = $client->get($paymentId);

                    if ($payment && $payment->status === 'approved') {
                        // El external_reference contiene nuestro order_number
                        $orderNumber = $payment->external_reference;
                        
                        $order = Order::where('order_number', $orderNumber)->first();
                        
                        if ($order && $order->payment_status !== 'paid') {
                            $order->update([
                                'payment_status' => 'paid',
                                'status' => 'processing',
                            ]);
                            Log::info("Orden {$orderNumber} marcada como pagada por webhook.");
                        }
                    }
                }
            }

            return response()->json(['status' => 'success'], 200);

        } catch (\Exception $e) {
            Log::error('Error procesando webhook MP: ' . $e->getMessage());
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}
