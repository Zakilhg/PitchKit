@extends('admin.layout')
@section('title', 'Dashboard')

@php
    use App\Support\Money;
    $max = max(1, collect($chart)->max('cents'));
    $chartTotal = collect($chart)->sum('cents');
@endphp

@section('content')
    <div class="page-head">
        <div>
            <h1>Dashboard</h1>
            <p class="muted">Sales over the last 30 days and what needs your attention.</p>
        </div>
        <a href="{{ route('jersey.create') }}" class="btn btn-primary">
            @include('admin.partials.icon', ['name' => 'plus'])
            Add jersey
        </a>
    </div>

    @php
        $cards = [
            ['label' => 'Revenue · 30 days', 'value' => Money::format($stats['revenue']), 'icon' => 'trending', 'href' => route('order.index')],
            ['label' => 'Orders · 30 days', 'value' => number_format($stats['orders']), 'icon' => 'receipt', 'href' => route('order.index')],
            ['label' => 'Average order', 'value' => Money::format($stats['average']), 'icon' => 'tag', 'href' => route('order.index')],
            ['label' => 'To ship', 'value' => number_format($stats['toShip']), 'icon' => 'truck', 'href' => route('order.index', ['status' => 'paid'])],
            ['label' => 'Units in stock', 'value' => number_format($stats['units']), 'icon' => 'package', 'href' => route('jersey.index')],
        ];
    @endphp

    <ul class="stats">
        @foreach ($cards as $card)
            <li>
                <a class="stat" href="{{ $card['href'] }}">
                    <span class="stat-icon">@include('admin.partials.icon', ['name' => $card['icon']])</span>
                    <span class="stat-label">{{ $card['label'] }}</span>
                    <span class="stat-value">{{ $card['value'] }}</span>
                </a>
            </li>
        @endforeach
    </ul>

    <section class="panel chart-panel" aria-labelledby="chart-title">
        <div class="panel-head">
            <div>
                <h2 id="chart-title">Revenue, last 14 days</h2>
                <p class="muted">{{ Money::format($chartTotal) }} from paid orders</p>
            </div>
        </div>
        <div class="bar-chart" role="img"
             aria-label="Daily revenue for the last 14 days, {{ Money::format($chartTotal) }} in total">
            @foreach ($chart as $day)
                @php $pct = $day['cents'] ? max(4, round($day['cents'] / $max * 100)) : 0; @endphp
                <div class="bar" title="{{ $day['date']->format('D j M') }}: {{ Money::format($day['cents']) }}">
                    <span class="bar-track"><span class="bar-fill" style="--h: {{ $pct }}%; --i: {{ $loop->index }}"></span></span>
                    <span class="bar-label">{{ $day['date']->format('j') }}</span>
                </div>
            @endforeach
        </div>
    </section>

    <div class="grid-2">
        <section class="panel" aria-labelledby="orders-title">
            <div class="panel-head">
                <h2 id="orders-title">Latest orders</h2>
                <a href="{{ route('order.index') }}" class="link">View all</a>
            </div>
            @if ($recentOrders->isEmpty())
                <p class="empty">No orders yet. Place one from the storefront to see it here.</p>
            @else
                <ul class="list">
                    @foreach ($recentOrders as $order)
                        <li>
                            <span class="list-main">
                                <a href="{{ route('order.show', $order) }}" class="list-title mono">{{ $order->reference() }}</a>
                                <small class="muted">{{ $order->name }} · {{ (int) $order->items_sum_quantity }} {{ Str::plural('item', (int) $order->items_sum_quantity) }}</small>
                            </span>
                            @include('admin.partials.order-status', ['status' => $order->status])
                            <span class="num">{{ Money::format($order->total_cents, $order->currency) }}</span>
                        </li>
                    @endforeach
                </ul>
            @endif
        </section>

        <section class="panel" aria-labelledby="stock-title">
            <div class="panel-head">
                <h2 id="stock-title">Low stock</h2>
                @if ($stats['outOfStock'] > 0)
                    <span class="badge badge-danger">{{ $stats['outOfStock'] }} out of stock</span>
                @endif
            </div>
            @if ($lowStock->isEmpty())
                <p class="empty">Every jersey has more than {{ $lowStockLimit }} in stock.</p>
            @else
                <ul class="list">
                    @foreach ($lowStock as $jersey)
                        <li>
                            <img class="thumb" src="{{ asset('images/'.$jersey->image) }}" alt="" width="40" height="40" loading="lazy">
                            <a href="{{ route('jersey.edit', $jersey) }}" class="list-title">{{ $jersey->name }}</a>
                            @if ($jersey->quantity <= 0)
                                <span class="badge badge-danger">Out of stock</span>
                            @else
                                <span class="badge badge-warning">{{ $jersey->quantity }} left</span>
                            @endif
                        </li>
                    @endforeach
                </ul>
            @endif
        </section>
    </div>
@endsection
