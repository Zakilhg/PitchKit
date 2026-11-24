<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\JerseyResource;
use App\Models\Jersey;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class JerseyController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:100'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'club_id' => ['nullable', 'integer', 'exists:clubs,id'],
            'league_id' => ['nullable', 'integer', 'exists:leagues,id'],
        ]);

        $jerseys = Jersey::query()
            ->with(['brand', 'club', 'league', 'sizes'])
            ->where('is_active', true)
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query
                        ->where('name', 'like', '%'.$search.'%')
                        ->orWhere('description', 'like', '%'.$search.'%');
                });
            })
            ->when($filters['brand_id'] ?? null, fn ($query, $brandId) => $query->where('brand_id', $brandId))
            ->when($filters['club_id'] ?? null, fn ($query, $clubId) => $query->where('club_id', $clubId))
            ->when($filters['league_id'] ?? null, fn ($query, $leagueId) => $query->where('league_id', $leagueId))
            ->orderByDesc('created_at')
            ->paginate(24)
            ->withQueryString();

        return JerseyResource::collection($jerseys);
    }

    public function show(Jersey $jersey): JerseyResource
    {
        return new JerseyResource($jersey->load(['brand', 'club', 'league', 'sizes']));
    }
}
