@extends('admin.layout')
@section('title', 'Orders')

@php use App\Support\Money; @endphp

@section('content')
    <div class="page-head">
        <div>
            <h1>Orders</h1>
            <p class="muted">{{ $orders->total() }} {{ Str::plural('order', $orders->total()) }}{{ $status !== '' ? ' in this view' : '' }}.</p>
        </div>
    </div>

    <nav class="tabs" aria-label="Filter orders">
        @foreach ($filters as $key => $label)
            @php
                $count = match ($key) {
                    '' => $counts->sum(),
                    'closed' => ($counts['cancelled'] ?? 0) + ($counts['expired'] ?? 0),
                    default => $counts[$key] ?? 0,
                };
            @endphp
            <a href="{{ route('order.index', array_filter(['status' => $key, 'search' => $search])) }}"
               @class(['tab', 'is-active' => $status === $key])
               @if ($status === $key) aria-current="page" @endif>
                {{ $label }} <span class="tab-count">{{ $count }}</span>
            </a>
        @endforeach
    </nav>

    <div class="panel">
        <form class="toolbar" method="GET" action="{{ route('order.index') }}" role="search">
            @if ($status !== '')<input type="hidden" name="status" value="{{ $status }}">@endif
            <label class="search">
                <span class="visually-hidden">Search orders</span>
                @include('admin.partials.icon', ['name' => 'search'])
                <input type="search" name="search" value="{{ $search }}" placeholder="Order number, name or email">
            </label>
            <button type="submit" class="btn btn-secondary">Search</button>
            @if ($search !== '')
                <a href="{{ route('order.index', array_filter(['status' => $status])) }}" class="link">Clear</a>
            @endif
        </form>

        @if ($orders->isEmpty())
            <p class="empty">
                @if ($search !== '' || $status !== '')
                    No orders match this view.
                @else
                    No orders yet. They appear here as soon as someone checks out.
                @endif
            </p>
        @else
            <div class="table-wrap">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Order</th>
                        <th scope="col">Customer</th>
                        <th scope="col" class="hide-md">Placed</th>
                        <th scope="col" class="num">Items</th>
                        <th scope="col" class="num">Total</th>
                        <th scope="col">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($orders as $order)
                        <tr>
                            <td>
                                <a class="row-title mono" href="{{ route('order.show', $order) }}">{{ $order->reference() }}</a>
                                @if ($order->needs_attention)
                                    <span class="badge badge-danger" title="Paid after the stock ran out">Check stock</span>
                                @endif
                            </td>
                            <td>
                                <span class="cell-stack">
                                    <span>{{ $order->name }}</span>
                                    <small class="muted">{{ $order->email }}</small>
                                </span>
                            </td>
                            <td class="hide-md">
                                <time datetime="{{ $order->created_at->toIso8601String() }}" title="{{ $order->created_at->toDayDateTimeString() }}">
                                    {{ $order->created_at->diffForHumans() }}
                                </time>
                            </td>
                            <td class="num">{{ (int) $order->items_sum_quantity }}</td>
                            <td class="num">{{ Money::format($order->total_cents, $order->currency) }}</td>
                            <td>@include('admin.partials.order-status', ['status' => $order->status])</td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            {{ $orders->links('admin.partials.pagination') }}
        @endif
    </div>
@endsection
