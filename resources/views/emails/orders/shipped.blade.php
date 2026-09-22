<x-mail::message>
# ¡Tu orden va en camino!

Hola {{ $order->user ? $order->user->name : $order->guest_name }},

Nos alegra informarte que tu orden **#{{ $order->id }}** ha sido enviada y pronto llegará a tus manos.

@if($order->tracking_code)
**Código de Rastreo:** {{ $order->tracking_code }}
@endif

<x-mail::button :url="route('home')">
Visitar Tienda
</x-mail::button>

Gracias por confiar en nosotros,<br>
{{ config('app.name') }}
</x-mail::message>
