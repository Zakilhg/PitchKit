@extends('admin.layout')
@section('title', 'Discount codes')

@php use App\Support\Money; @endphp

@section('content')
    <div class="page-head">
        <div>
            <h1>Discount codes</h1>
            <p class="muted">Customers enter these at checkout. The server checks every rule, so a code can't be stretched past its limits.</p>
        </div>
        <a href="{{ route('discount-code.create') }}" class="btn btn-primary">
            @include('admin.partials.icon', ['name' => 'plus'])
            Add code
        </a>
    </div>

    <div class="panel">
        @if ($codes->isEmpty())
            <p class="empty">No discount codes yet. Add one to offer money off, a percentage, or free shipping.</p>
        @else
            <div class="table-wrap">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Code</th>
                        <th scope="col">Discount</th>
                        <th scope="col" class="num">Used</th>
                        <th scope="col" class="hide-md">Expires</th>
                        <th scope="col">Status</th>
                        <th scope="col"><span class="visually-hidden">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($codes as $code)
                        @php
                            $status = $code->status();
                            $badge = ['Active' => 'badge-success', 'Off' => 'badge-muted', 'Expired' => 'badge-muted', 'Used up' => 'badge-warning'][$status];
                        @endphp
                        <tr>
                            <td><a class="row-title mono" href="{{ route('discount-code.edit', $code) }}">{{ $code->code }}</a></td>
                            <td>
                                <span class="cell-stack">
                                    <span>{{ $code->label() }}</span>
                                    @if ($code->min_subtotal_cents > 0)
                                        <small class="muted">On orders from {{ Money::format($code->min_subtotal_cents) }}</small>
                                    @endif
                                </span>
                            </td>
                            <td class="num">
                                {{ $code->used_count }}@if ($code->max_uses !== null)<span class="muted"> / {{ $code->max_uses }}</span>@endif
                            </td>
                            <td class="hide-md">
                                @if ($code->expires_at)
                                    <time datetime="{{ $code->expires_at->toIso8601String() }}">{{ $code->expires_at->toFormattedDateString() }}</time>
                                @else
                                    <span class="muted">Never</span>
                                @endif
                            </td>
                            <td><span class="badge {{ $badge }}">{{ $status }}</span></td>
                            <td>
                                @include('admin.partials.row-actions', [
                                    'edit' => route('discount-code.edit', $code),
                                    'destroy' => route('discount-code.destroy', $code),
                                    'name' => $code->code,
                                ])
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
@endsection
