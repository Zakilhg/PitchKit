@if ($paginator->hasPages())
    <nav class="pagination" aria-label="Pagination">
        <p class="muted">
            Showing {{ $paginator->firstItem() }}–{{ $paginator->lastItem() }} of {{ $paginator->total() }}
        </p>
        <div class="pagination-links">
            @if ($paginator->onFirstPage())
                <span class="btn btn-secondary is-disabled" aria-disabled="true">Previous</span>
            @else
                <a class="btn btn-secondary" href="{{ $paginator->previousPageUrl() }}" rel="prev">Previous</a>
            @endif
            @if ($paginator->hasMorePages())
                <a class="btn btn-secondary" href="{{ $paginator->nextPageUrl() }}" rel="next">Next</a>
            @else
                <span class="btn btn-secondary is-disabled" aria-disabled="true">Next</span>
            @endif
        </div>
    </nav>
@endif
