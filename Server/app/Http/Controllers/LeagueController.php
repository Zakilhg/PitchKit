<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\StoresCatalogImages;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class LeagueController extends Controller
{
    use StoresCatalogImages;

    public function apiLeague()
    {
        return League::all();
    }

    public function index(): View
    {
        $leagues = League::orderBy('name')->get();
        $clubCounts = Club::selectRaw('league_id, count(*) as total')->groupBy('league_id')->pluck('total', 'league_id');
        $jerseyCounts = Jersey::selectRaw('league_id, count(*) as total')->groupBy('league_id')->pluck('total', 'league_id');

        return view('admin.leagues.index', compact('leagues', 'clubCounts', 'jerseyCounts'));
    }

    public function create(): View
    {
        return view('admin.leagues.form', ['league' => new League]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, creating: true);

        League::create($data + $this->storeImages($request, ['image']));

        return redirect()->route('league.index')->with('success', "{$data['name']} was added.");
    }

    public function edit(League $league): View
    {
        return view('admin.leagues.form', compact('league'));
    }

    public function update(Request $request, League $league): RedirectResponse
    {
        $data = $this->validated($request, creating: false);

        $league->update($data + $this->storeImages($request, ['image']));

        return redirect()->route('league.index')->with('success', "{$league->name} was updated.");
    }

    public function destroy(League $league): RedirectResponse
    {
        if (Club::where('league_id', $league->id)->exists() || Jersey::where('league_id', $league->id)->exists()) {
            return back()->with('error', "{$league->name} still has clubs or jerseys. Move or delete them first.");
        }

        $league->delete();

        return redirect()->route('league.index')->with('success', "{$league->name} was deleted.");
    }

    private function validated(Request $request, bool $creating): array
    {
        return collect($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => $this->imageRules($creating),
        ], [], ['image' => 'logo']))->except('image')->all();
    }
}
