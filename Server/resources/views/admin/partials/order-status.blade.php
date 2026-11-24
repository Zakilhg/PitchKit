{{-- Expects: $status --}}
@php
    [$label, $tone] = match ($status) {
        'paid' => ['To ship', 'badge-warning'],
        'fulfilled' => ['Shipped', 'badge-success'],
        'pending' => ['Awaiting payment', ''],
        'cancelled' => ['Cancelled', 'badge-muted'],
        'expired' => ['Expired', 'badge-muted'],
        default => [ucfirst($status), ''],
    };
@endphp
<span @class(['badge', $tone])>{{ $label }}</span>
