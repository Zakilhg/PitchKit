@extends('admin.layout')
@php
    use App\Models\DiscountCode;
    $editing = $code->exists;
    $type = old('type', $code->type);
    $value = old('value', match ($code->type) {
        DiscountCode::FIXED => $code->value ? number_format($code->value / 100, 2, '.', '') : '',
        DiscountCode::PERCENT => $code->value ?: '',
        default => '',
    });
    $minSubtotal = old('min_subtotal', $code->min_subtotal_cents ? number_format($code->min_subtotal_cents / 100, 2, '.', '') : '');
    $types = [
        DiscountCode::PERCENT => 'Percentage off the items',
        DiscountCode::FIXED => 'Fixed amount off the items',
        DiscountCode::FREE_SHIPPING => 'Free shipping',
    ];
    $field = fn (string $name) => $errors->has($name) ? "aria-invalid=true aria-describedby={$name}-error" : '';
@endphp
@section('title', $editing ? 'Edit '.$code->code : 'Add discount code')

@section('content')
    <a href="{{ route('discount-code.index') }}" class="back">
        @include('admin.partials.icon', ['name' => 'arrow-left'])
        Discount codes
    </a>
    <div class="page-head">
        <h1>{{ $editing ? 'Edit '.$code->code : 'Add discount code' }}</h1>
    </div>

    <form class="panel form-narrow" method="POST" novalidate
          action="{{ $editing ? route('discount-code.update', $code) : route('discount-code.store') }}">
        @csrf
        @if ($editing) @method('PUT') @endif

        <div class="field">
            <label class="label" for="code">Code</label>
            <input class="input mono" type="text" id="code" name="code" required maxlength="32" autocapitalize="characters"
                   value="{{ old('code', $code->code) }}" placeholder="SUMMER20" {!! $field('code') !!}>
            @error('code')<p class="error" id="code-error">{{ $message }}</p>@else<p class="hint">Letters, numbers, dashes and underscores. Customers can type it in any case.</p>@enderror
        </div>

        <div class="field-row">
            <div class="field">
                <label class="label" for="type">Type</label>
                <select class="input" id="type" name="type" required data-discount-type {!! $field('type') !!}>
                    @foreach ($types as $key => $label)
                        <option value="{{ $key }}" @selected($type === $key)>{{ $label }}</option>
                    @endforeach
                </select>
                @error('type')<p class="error" id="type-error">{{ $message }}</p>@enderror
            </div>

            <div class="field" data-discount-value @if ($type === DiscountCode::FREE_SHIPPING) hidden @endif>
                <label class="label" for="value">
                    <span data-when="percent" @if ($type !== DiscountCode::PERCENT) hidden @endif>Percentage</span>
                    <span data-when="fixed" @if ($type !== DiscountCode::FIXED) hidden @endif>Amount in dollars</span>
                </label>
                <input class="input" type="number" id="value" name="value" min="0" step="0.01" inputmode="decimal"
                       value="{{ $value }}" {!! $field('value') !!}>
                @error('value')<p class="error" id="value-error">{{ $message }}</p>@enderror
            </div>
        </div>

        <div class="field-row">
            <div class="field">
                <label class="label" for="min_subtotal">Minimum order <span class="optional">Optional, in dollars</span></label>
                <input class="input" type="number" id="min_subtotal" name="min_subtotal" min="0" step="0.01" inputmode="decimal"
                       value="{{ $minSubtotal }}" {!! $field('min_subtotal') !!}>
                @error('min_subtotal')<p class="error" id="min_subtotal-error">{{ $message }}</p>@enderror
            </div>
            <div class="field">
                <label class="label" for="max_uses">Usage limit <span class="optional">Optional</span></label>
                <input class="input" type="number" id="max_uses" name="max_uses" min="1" step="1" inputmode="numeric"
                       value="{{ old('max_uses', $code->max_uses) }}" {!! $field('max_uses') !!}>
                @error('max_uses')<p class="error" id="max_uses-error">{{ $message }}</p>@else<p class="hint">Unpaid orders give their use back.@if ($editing) Used {{ $code->used_count }} {{ Str::plural('time', $code->used_count) }} so far.@endif</p>@enderror
            </div>
        </div>

        <div class="field">
            <label class="label" for="expires_at">Last day <span class="optional">Optional</span></label>
            <input class="input" type="date" id="expires_at" name="expires_at"
                   value="{{ old('expires_at', $code->expires_at?->toDateString()) }}" {!! $field('expires_at') !!}>
            @error('expires_at')<p class="error" id="expires_at-error">{{ $message }}</p>@else<p class="hint">The code works until the end of this day.</p>@enderror
        </div>

        <div class="field">
            <label class="switch">
                <input type="hidden" name="is_active" value="0">
                <input type="checkbox" name="is_active" value="1" @checked(old('is_active', $code->is_active))>
                <span>Customers can use this code</span>
            </label>
        </div>

        <div class="form-actions">
            <button type="submit" class="btn btn-primary">{{ $editing ? 'Save changes' : 'Add code' }}</button>
            <a href="{{ route('discount-code.index') }}" class="btn btn-secondary">Cancel</a>
        </div>
    </form>

    <script>
        // Show the right label for the amount, and hide it for free shipping.
        (() => {
            const type = document.querySelector('[data-discount-type]');
            const field = document.querySelector('[data-discount-value]');
            const sync = () => {
                field.hidden = type.value === 'free_shipping';
                field.querySelectorAll('[data-when]').forEach((el) => { el.hidden = el.dataset.when !== type.value; });
            };
            type.addEventListener('change', sync);
        })();
    </script>
@endsection
