@extends('admin.layout')
@section('title', $order->reference())

@php
    use App\Support\Money;
    $address = $order->shipping_address ?? [];
@endphp

@section('content')
    <a href="{{ route('order.index') }}" class="back">
        @include('admin.partials.icon', ['name' => 'arrow-left'])
        Orders
    </a>
    <div class="page-head">
        <div>
            <h1 class="title-with-badge">
                <span class="mono">{{ $order->reference() }}</span>
                @include('admin.partials.order-status', ['status' => $order->status])
            </h1>
            <p class="muted">
                Placed {{ $order->created_at->toDayDateTimeString() }}
                · paid with {{ $order->gateway === 'test' ? 'the test gateway' : ucfirst($order->gateway) }}
            </p>
        </div>
        <div class="page-actions">
            @if ($order->status === 'paid')
                <form method="POST" action="{{ route('order.fulfil', $order) }}">
                    @csrf
                    <button type="submit" class="btn btn-primary">
                        @include('admin.partials.icon', ['name' => 'truck'])
                        Mark as shipped
                    </button>
                </form>
            @elseif ($order->status === 'pending')
                <form method="POST" action="{{ route('order.cancel', $order) }}"
                      data-confirm="Cancel {{ $order->reference() }} and put its items back in stock?">
                    @csrf
                    <button type="submit" class="btn btn-secondary">Cancel order</button>
                </form>
            @endif
        </div>
    </div>

    @if ($order->needs_attention)
        <div class="flash flash-error" role="alert">
            @include('admin.partials.icon', ['name' => 'alert'])
            <span>This order was paid after its reservation expired and some items had sold out meanwhile. Check stock before shipping.</span>
        </div>
    @endif

    <div class="form-layout">
        <section class="panel" aria-labelledby="items-title">
            <h2 id="items-title" class="panel-title">Items</h2>
            <ul class="list order-lines">
                @foreach ($order->items as $item)
                    <li>
                        <img class="thumb" src="{{ $item->image ? asset('images/'.$item->image) : '' }}" alt="" width="48" height="48" loading="lazy">
                        <span class="list-main">
                            @if ($item->jersey)
                                <a href="{{ route('jersey.edit', $item->jersey) }}" class="list-title">{{ $item->name }}</a>
                            @else
                                <span class="list-title">{{ $item->name }}</span>
                            @endif
                            <small class="muted">Size {{ $item->size }} · {{ $item->quantity }} × {{ Money::format($item->unit_price_cents, $order->currency) }}</small>
                        </span>
                        <span class="num">{{ Money::format($item->lineTotalCents(), $order->currency) }}</span>
                    </li>
                @endforeach
            </ul>
            <dl class="totals">
                <div><dt>Subtotal</dt><dd>{{ Money::format($order->subtotal_cents, $order->currency) }}</dd></div>
                @if ($order->discount_cents > 0)
                    <div><dt>Discount <span class="mono muted">{{ $order->discount_code }}</span></dt><dd>−{{ Money::format($order->discount_cents, $order->currency) }}</dd></div>
                @endif
                <div><dt>
                    Shipping
                    @if ($order->discount_code && ! $order->discount_cents)
                        <span class="mono muted">{{ $order->discount_code }}</span>
                    @endif
                </dt><dd>{{ $order->shipping_cents ? Money::format($order->shipping_cents, $order->currency) : 'Free' }}</dd></div>
                <div class="totals-grand"><dt>Total</dt><dd>{{ Money::format($order->total_cents, $order->currency) }}</dd></div>
            </dl>
        </section>

        <div class="form-side">
            <section class="panel" aria-labelledby="customer-title">
                <h2 id="customer-title" class="panel-title">Customer</h2>
                <p><strong>{{ $order->name }}</strong></p>
                <p><a class="link" href="mailto:{{ $order->email }}">{{ $order->email }}</a></p>
                <p class="muted">{{ $order->user ? 'Has an account' : 'Guest checkout' }}</p>
            </section>
            <section class="panel" aria-labelledby="ship-title">
                <h2 id="ship-title" class="panel-title">Ship to</h2>
                <address class="address">
                    {{ $order->name }}<br>
                    {{ $address['line1'] ?? '' }}<br>
                    @if (! empty($address['line2'])){{ $address['line2'] }}<br>@endif
                    {{ $address['postal_code'] ?? '' }} {{ $address['city'] ?? '' }}<br>
                    {{ $address['country'] ?? '' }}
                </address>
            </section>
            <section class="panel" aria-labelledby="timeline-title">
                <h2 id="timeline-title" class="panel-title">Timeline</h2>
                <ol class="timeline">
                    <li><span>Placed</span><time>{{ $order->created_at->format('M j, H:i') }}</time></li>
                    @if ($order->paid_at)<li><span>Paid</span><time>{{ $order->paid_at->format('M j, H:i') }}</time></li>@endif
                    @if ($order->fulfilled_at)<li><span>Shipped</span><time>{{ $order->fulfilled_at->format('M j, H:i') }}</time></li>@endif
                    @if (in_array($order->status, ['cancelled', 'expired']))<li><span>{{ ucfirst($order->status) }}</span><time>{{ $order->updated_at->format('M j, H:i') }}</time></li>@endif
                    @if ($order->status === 'pending' && $order->expires_at)<li class="muted"><span>Hold ends</span><time>{{ $order->expires_at->format('M j, H:i') }}</time></li>@endif
                </ol>
            </section>
        </div>
    </div>
@endsection
