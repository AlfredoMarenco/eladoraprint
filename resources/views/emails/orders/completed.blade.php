<x-mail::message>
# ¡Tu orden ha sido completada!

Hola {{ $order->user ? $order->user->name : $order->guest_name }},

Queremos confirmar que tu orden **#{{ $order->id }}** ha sido completada y entregada satisfactoriamente.

Esperamos que disfrutes de tu compra. ¡Nos encantaría volver a verte pronto!

<x-mail::button :url="route('home')">
Visitar Tienda
</x-mail::button>

Gracias por confiar en nosotros,<br>
{{ config('app.name') }}
</x-mail::message>
