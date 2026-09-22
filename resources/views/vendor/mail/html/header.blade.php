@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel' || trim($slot) === config('app.name'))
<img src="{{ asset('images/logo.png') }}" class="logo" alt="Eladora Print Logo" style="max-height: 50px;">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
