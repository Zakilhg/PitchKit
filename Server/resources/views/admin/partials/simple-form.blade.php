{{--
    Shared create/edit form for brands, leagues and clubs.
    Expects: $model, $resource (route prefix), $singular, $plural, $imageLabel, $leagues (clubs only, optional)
--}}
@extends('admin.layout')
@php $editing = $model->exists; @endphp
@section('title', $editing ? 'Edit '.$model->name : 'Add '.$singular)

@section('content')
    <a href="{{ route($resource.'.index') }}" class="back">
        @include('admin.partials.icon', ['name' => 'arrow-left'])
        {{ ucfirst($plural) }}
    </a>
    <div class="page-head">
        <h1>{{ $editing ? 'Edit '.$singular : 'Add '.$singular }}</h1>
    </div>

    <form class="panel form-narrow" method="POST" enctype="multipart/form-data" novalidate
          action="{{ $editing ? route($resource.'.update', $model) : route($resource.'.store') }}">
        @csrf
        @if ($editing) @method('PUT') @endif

        <div class="field">
            <label class="label" for="name">Name</label>
            <input class="input" type="text" id="name" name="name" required maxlength="255"
                   value="{{ old('name', $model->name) }}"
                   @error('name') aria-invalid="true" aria-describedby="name-error" @enderror>
            @error('name')<p class="error" id="name-error">{{ $message }}</p>@enderror
        </div>

        @isset($leagues)
            <div class="field">
                <label class="label" for="league_id">League</label>
                <select class="input" id="league_id" name="league_id" required
                        @error('league_id') aria-invalid="true" aria-describedby="league_id-error" @enderror>
                    <option value="">Choose a league</option>
                    @foreach ($leagues as $league)
                        <option value="{{ $league->id }}" @selected((string) old('league_id', $model->league_id) === (string) $league->id)>
                            {{ $league->name }}
                        </option>
                    @endforeach
                </select>
                @error('league_id')<p class="error" id="league_id-error">{{ $message }}</p>@enderror
            </div>
        @endisset

        @include('admin.partials.image-field', [
            'name' => 'image',
            'label' => $imageLabel,
            'current' => $model->image,
            'required' => true,
            'hint' => 'PNG with a transparent background works best, up to 4 MB.',
        ])

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">{{ $editing ? 'Save changes' : 'Add '.$singular }}</button>
            <a href="{{ route($resource.'.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>
@endsection
