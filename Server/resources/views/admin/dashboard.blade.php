@extends('admin.layout')
@section('title', 'Dashboard')

@section('content')
    <div class="page-head">
        <div>
            <h1>Dashboard</h1>
            <p class="muted">What's in the store right now.</p>
        </div>
        <a href="{{ route('jersey.create') }}" class="btn btn-primary">
            @include('admin.partials.icon', ['name' => 'plus'])
            Add jersey
        </a>
    </div>

    @php
        $cards = [
            ['label' => 'Jerseys', 'value' => $stats['jerseys'], 'icon' => 'shirt', 'href' => route('jersey.index')],
            ['label' => 'Units in stock', 'value' => $stats['units'], 'icon' => 'package', 'href' => route('jersey.index')],
            ['label' => 'Clubs', 'value' => $stats['clubs'], 'icon' => 'shield', 'href' => route('club.index')],
            ['label' => 'Leagues', 'value' => $stats['leagues'], 'icon' => 'trophy', 'href' => route('league.index')],
            ['label' => 'Brands', 'value' => $stats['brands'], 'icon' => 'tag', 'href' => route('brand.index')],
        ];
    @endphp

    <ul class="stats">
        @foreach ($cards as $card)
            <li>
                <a class="stat" href="{{ $card['href'] }}">
                    <span class="stat-icon">@include('admin.partials.icon', ['name' => $card['icon']])</span>
                    <span class="stat-label">{{ $card['label'] }}</span>
                    <span class="stat-value">{{ number_format($card['value']) }}</span>
                </a>
            </li>
        @endforeach
    </ul>

    <div class="grid-2">
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

        <section class="panel" aria-labelledby="recent-title">
            <div class="panel-head">
                <h2 id="recent-title">Recently added</h2>
                <a href="{{ route('jersey.index') }}" class="link">View all</a>
            </div>
            @if ($recent->isEmpty())
                <p class="empty">
                    No jerseys yet. <a class="link" href="{{ route('jersey.create') }}">Add the first one</a>.
                </p>
            @else
                <ul class="list">
                    @foreach ($recent as $jersey)
                        <li>
                            <img class="thumb" src="{{ asset('images/'.$jersey->image) }}" alt="" width="40" height="40" loading="lazy">
                            <span class="list-main">
                                <a href="{{ route('jersey.edit', $jersey) }}" class="list-title">{{ $jersey->name }}</a>
                                <small class="muted">{{ $jersey->club?->name }} · {{ $jersey->brand?->name }}</small>
                            </span>
                            <span class="num">${{ number_format((float) $jersey->price, 2) }}</span>
                        </li>
                    @endforeach
                </ul>
            @endif
        </section>
    </div>
@endsection
