{{--
    Shared list page for brands, leagues and clubs.
    Expects: $items, $resource, $singular, $plural, $columns (label => closure returning the cell text)
--}}
@extends('admin.layout')
@section('title', ucfirst($plural))

@section('content')
    @php $total = method_exists($items, 'total') ? $items->total() : $items->count(); @endphp
    <div class="page-head">
        <div>
            <h1>{{ ucfirst($plural) }}</h1>
            <p class="muted">{{ $total }} {{ Str::plural($singular, $total) }}.</p>
        </div>
        <a href="{{ route($resource.'.create') }}" class="btn btn-primary">
            @include('admin.partials.icon', ['name' => 'plus'])
            Add {{ $singular }}
        </a>
    </div>

    <div class="panel">
        @if ($items->isEmpty())
            <p class="empty">No {{ $plural }} yet. <a class="link" href="{{ route($resource.'.create') }}">Add the first one</a>.</p>
        @else
            <div class="table-wrap">
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">{{ ucfirst($singular) }}</th>
                        @foreach ($columns as $label => $value)
                            <th scope="col" @class(['num' => str_contains($label, '#')])>{{ str_replace('#', '', $label) }}</th>
                        @endforeach
                        <th scope="col"><span class="visually-hidden">Actions</span></th>
                    </tr>
                    </thead>
                    <tbody>
                    @foreach ($items as $item)
                        <tr>
                            <td>
                                <div class="cell-media">
                                    <img class="thumb thumb-logo" src="{{ asset('images/'.$item->image) }}" alt="" width="44" height="44" loading="lazy">
                                    <a class="row-title" href="{{ route($resource.'.edit', $item) }}">{{ $item->name }}</a>
                                </div>
                            </td>
                            @foreach ($columns as $label => $value)
                                <td @class(['num' => str_contains($label, '#')])>{{ $value($item) }}</td>
                            @endforeach
                            <td>
                                @include('admin.partials.row-actions', [
                                    'edit' => route($resource.'.edit', $item),
                                    'destroy' => route($resource.'.destroy', $item),
                                    'name' => $item->name,
                                ])
                            </td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            @if (method_exists($items, 'links'))
                {{ $items->links('admin.partials.pagination') }}
            @endif
        @endif
    </div>
@endsection
