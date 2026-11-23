@extends('admin.layout')
@php $editing = $jersey->exists; @endphp
@section('title', $editing ? 'Edit '.$jersey->name : 'Add jersey')

@section('content')
    <a href="{{ route('jersey.index') }}" class="back">
        @include('admin.partials.icon', ['name' => 'arrow-left'])
        Jerseys
    </a>
    <div class="page-head">
        <h1>{{ $editing ? 'Edit jersey' : 'Add jersey' }}</h1>
    </div>

    @if ($errors->any())
        <div class="flash flash-error" role="alert">
            @include('admin.partials.icon', ['name' => 'alert'])
            <span>Check the {{ Str::plural('field', $errors->count()) }} marked below.</span>
        </div>
    @endif

    <form class="form-layout" method="POST" enctype="multipart/form-data" novalidate
          action="{{ $editing ? route('jersey.update', $jersey) : route('jersey.store') }}">
        @csrf
        @if ($editing) @method('PUT') @endif

        <div class="form-main">
            <section class="panel" aria-labelledby="details-title">
                <h2 id="details-title" class="panel-title">Details</h2>

                <div class="field">
                    <label class="label" for="name">Name</label>
                    <input class="input" type="text" id="name" name="name" required maxlength="255"
                           value="{{ old('name', $jersey->name) }}" placeholder="FC Barcelona Home Jersey"
                           @error('name') aria-invalid="true" aria-describedby="name-error" @enderror>
                    @error('name')<p class="error" id="name-error">{{ $message }}</p>@enderror
                </div>

                <div class="field">
                    <label class="label" for="description">Description <span class="optional">optional</span></label>
                    <textarea class="input" id="description" name="description" rows="4" maxlength="2000"
                              @error('description') aria-invalid="true" aria-describedby="description-error" @enderror>{{ old('description', $jersey->description) }}</textarea>
                    @error('description')<p class="error" id="description-error">{{ $message }}</p>@enderror
                </div>

                <div class="field-row">
                    <div class="field">
                        <label class="label" for="price">Price</label>
                        <div class="input-prefix">
                            <span aria-hidden="true">$</span>
                            <input class="input" type="number" id="price" name="price" step="0.01" min="0" required
                                   inputmode="decimal" value="{{ old('price', $jersey->price) }}"
                                   @error('price') aria-invalid="true" aria-describedby="price-error" @enderror>
                        </div>
                        @error('price')<p class="error" id="price-error">{{ $message }}</p>@enderror
                    </div>
                    <div class="field">
                        <label class="label" for="quantity">Stock</label>
                        <input class="input" type="number" id="quantity" name="quantity" min="0" step="1" required
                               inputmode="numeric" value="{{ old('quantity', $jersey->quantity) }}"
                               @error('quantity') aria-invalid="true" aria-describedby="quantity-error" @else aria-describedby="quantity-hint" @enderror>
                        @error('quantity')
                            <p class="error" id="quantity-error">{{ $message }}</p>
                        @else
                            <p class="hint" id="quantity-hint">Units available across all sizes.</p>
                        @enderror
                    </div>
                </div>
            </section>

            <section class="panel" aria-labelledby="photos-title">
                <h2 id="photos-title" class="panel-title">Photos</h2>
                <p class="muted panel-lead">The first photo is used on product cards. Leave a slot empty to keep the current photo.</p>
                <div class="field-row field-row-3">
                    @include('admin.partials.image-field', ['name' => 'image', 'label' => 'Main photo', 'current' => $jersey->image, 'required' => true])
                    @include('admin.partials.image-field', ['name' => 'image1', 'label' => 'Second photo', 'current' => $jersey->image1, 'required' => false])
                    @include('admin.partials.image-field', ['name' => 'image2', 'label' => 'Third photo', 'current' => $jersey->image2, 'required' => false])
                </div>
            </section>
        </div>

        <div class="form-side">
            <section class="panel" aria-labelledby="org-title">
                <h2 id="org-title" class="panel-title">Organisation</h2>
                @foreach ([['club_id', 'Club', $clubs], ['league_id', 'League', $leagues], ['brand_id', 'Brand', $brands]] as [$field, $label, $options])
                    <div class="field">
                        <label class="label" for="{{ $field }}">{{ $label }}</label>
                        <select class="input" id="{{ $field }}" name="{{ $field }}" required
                                @error($field) aria-invalid="true" aria-describedby="{{ $field }}-error" @enderror>
                            <option value="">Choose a {{ strtolower($label) }}</option>
                            @foreach ($options as $option)
                                <option value="{{ $option->id }}" @selected((string) old($field, $jersey->{$field}) === (string) $option->id)>
                                    {{ $option->name }}
                                </option>
                            @endforeach
                        </select>
                        @error($field)<p class="error" id="{{ $field }}-error">{{ $message }}</p>@enderror
                    </div>
                @endforeach
            </section>

            <section class="panel" aria-labelledby="visibility-title">
                <h2 id="visibility-title" class="panel-title">Visibility</h2>
                <label class="switch">
                    <input type="hidden" name="is_active" value="0">
                    <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $jersey->is_active ?? true))>
                    <span>Show in the storefront</span>
                </label>
            </section>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">{{ $editing ? 'Save changes' : 'Add jersey' }}</button>
                <a href="{{ route('jersey.index') }}" class="btn btn-secondary">Cancel</a>
            </div>
        </div>
    </form>
@endsection
