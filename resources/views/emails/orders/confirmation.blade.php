<x-mail::message>
# Hola {{ $order->customer_name }},

¡Gracias por tu compra en Eladora Print!

Hemos recibido tu orden **{{ $order->order_number }}** y estamos procesándola. A continuación, te compartimos el detalle de tu pedido:

### Detalles de Envío
**Nombre:** {{ $order->customer_name }}
**Teléfono:** {{ $order->customer_phone }}
**Dirección:** {{ $order->shipping_address }}, {{ $order->shipping_city }}, {{ $order->shipping_state }}. CP: {{ $order->shipping_zip }}

<x-mail::table>
| Producto | Cantidad | Precio |
|:---------|:--------:|-------:|
@foreach($order->items as $item)
| {{ $item->product ? $item->product->name : 'Producto Eliminado' }} | {{ $item->quantity }} | ${{ number_format($item->subtotal, 2) }} |
@endforeach
| **Subtotal** | | **${{ number_format($order->total_amount - $order->shipping_cost, 2) }}** |
| **Envío** | | **${{ number_format($order->shipping_cost, 2) }}** |
| **Total** | | **${{ number_format($order->total_amount, 2) }}** |
</x-mail::table>

Si tienes alguna pregunta sobre tu orden, no dudes en contactarnos respondiendo a este correo.

<x-mail::button :url="config('app.url')">
Visitar Tienda
</x-mail::button>

Gracias,<br>
El equipo de {{ config('app.name') }}
</x-mail::message>
