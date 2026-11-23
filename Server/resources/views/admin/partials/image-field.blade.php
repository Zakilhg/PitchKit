{{-- Expects: $name, $label, $current (filename or null), $required (bool), $hint (optional) --}}
@php
    $id = 'field-'.$name;
    $previewId = 'preview-'.$name;
@endphp
<div class="field">
    <span class="label" id="{{ $id }}-label">
        {{ $label }}
        @unless ($required)<span class="optional">optional</span>@endunless
    </span>
    <label @class(['upload', 'has-image' => $current, 'is-invalid' => $errors->has($name)]) for="{{ $id }}">
        <img id="{{ $previewId }}" src="{{ $current ? asset('images/'.$current) : '' }}" alt="" @unless ($current) hidden @endunless>
        <span class="upload-empty">
            @include('admin.partials.icon', ['name' => 'upload'])
            <span>Choose image</span>
        </span>
        <span class="upload-change">Replace</span>
    </label>
    <input class="visually-hidden" type="file" id="{{ $id }}" name="{{ $name }}" accept="image/*"
           data-preview="{{ $previewId }}" aria-labelledby="{{ $id }}-label"
           @if ($required && ! $current) required @endif
           @error($name) aria-invalid="true" aria-describedby="{{ $id }}-error" @enderror>
    @error($name)
        <p class="error" id="{{ $id }}-error">{{ $message }}</p>
    @else
        <p class="hint">{{ $hint ?? 'JPG, PNG or WebP, up to 4 MB.' }}</p>
    @enderror
</div>
