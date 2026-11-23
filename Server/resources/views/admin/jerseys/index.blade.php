@extends('admin.layout')
@section('title', 'Jerseys')

@section('content')
    <div class="page-head">
        <div>
            <h1>Jerseys</h1>
            <p class="muted">{{ $jerseys->total() }} {{ Str::plural('jersey', $jerseys->total()) }} in the catalog.</p>
        </div>
        <a href="{{ route('jersey.create') }}" class="btn btn-primary">
            @include('admin.partials.icon', ['name' => 'plus'])
            Add jersey
        </a>
    </div>

    <div class="panel">
        <form class="toolbar" method="GET" action="{{ route('jersey.index') }}" role="search">
            <label class="search">
                <span class="visually-hidden">Search jerseys</span>
                @include('admin.partials.icon', ['name' => 'search'])
                <input type="search" name="search" value="{{ $search }}" placeholder="Search by name">
            </label>
            <button type="submit" class="btn btn-secondary">Search</button>
            @if ($search !== '')
                <a href="{{ route('jersey.index') }}" class="link">Clear</a>
            @endif
        </form>

        @if ($jerseys->isEmpty())
            <p class="empty">
                @if ($search !== '')
                    No jerseys match “{{ $search }}”.
                @else
                    No jerseys yet. <a class="link" href="{{ route('jersey.create') }}">Add the first one</a>.
                @endif
            </p>
        @else
            <div class="table-wrap">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Jersey</th>
                        <th scope="col" class="hide-md">Club</th>
                        <th scope="col" class="hide-md">Brand</th>
                        <th scope="col" class="num">Price</th>
                        <th scope="col" class="num">Stock</th>
                        <th scope="col">Status</th>
                        <th scope="col"><span class="visually-hidden">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($jerseys as $jersey)
                        <tr>
                            <td>
                                <div class="cell-media">
                                    <img class="thumb" src="{{ asset('images/'.$jersey->image) }}" alt="" width="44" height="44" loading="lazy">
                                    <span>
                                        <a class="row-title" href="{{ route('jersey.edit', $jersey) }}">{{ $jersey->name }}</a>
                                        <small class="muted">{{ $jersey->league?->name }}</small>
                                    </span>
                                </div>
                            </td>
                            <td class="hide-md">{{ $jersey->club?->name ?? '—' }}</td>
                            <td class="hide-md">{{ $jersey->brand?->name ?? '—' }}</td>
                            <td class="num">${{ number_format((float) $jersey->price, 2) }}</td>
                            <td class="num">
                                @if ($jersey->quantity <= 0)
                                    <span class="badge badge-danger">0</span>
                                @elseif ($jersey->quantity <= 10)
                                    <span class="badge badge-warning">{{ $jersey->quantity }}</span>
                                @else
                                    {{ $jersey->quantity }}
                                @endif
                            </td>
                            <td>
                                @if ($jersey->is_active)
                                    <span class="badge badge-success">Live</span>
                                @else
                                    <span class="badge">Hidden</span>
                                @endif
                            </td>
                            <td>
                                @include('admin.partials.row-actions', [
                                    'edit' => route('jersey.edit', $jersey),
                                    'destroy' => route('jersey.destroy', $jersey),
                                    'name' => $jersey->name,
                                ])
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            {{ $jerseys->links('admin.partials.pagination') }}
        @endif
    </div>
@endsection
