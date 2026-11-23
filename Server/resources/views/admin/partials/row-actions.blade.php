{{-- Expects: $edit (url), $destroy (url), $name --}}
<div class="row-actions">
    <a href="{{ $edit }}" class="icon-button" title="Edit">
        @include('admin.partials.icon', ['name' => 'pencil'])
        <span class="visually-hidden">Edit {{ $name }}</span>
    </a>
    <form method="POST" action="{{ $destroy }}" data-confirm="Delete {{ $name }}? This can't be undone.">
        @csrf
        @method('DELETE')
        <button type="submit" class="icon-button icon-button-danger" title="Delete">
            @include('admin.partials.icon', ['name' => 'trash'])
            <span class="visually-hidden">Delete {{ $name }}</span>
        </button>
    </form>
</div>
