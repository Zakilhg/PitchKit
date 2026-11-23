<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\StoresCatalogImages;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ClubController extends Controller
{
    use StoresCatalogImages;

    public function apiClub()
    {
        return Club::all();
    }

    public function index(): View
    {
        $clubs = Club::with('league')->orderBy('name')->paginate(20);
        $counts = Jersey::selectRaw('club_id, count(*) as total')->groupBy('club_id')->pluck('total', 'club_id');

        return view('admin.clubs.index', compact('clubs', 'counts'));
    }

    public function create(): View
    {
        return view('admin.clubs.form', ['club' => new Club, 'leagues' => League::orderBy('name')->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, creating: true);

        Club::create($data + $this->storeImages($request, ['image']));

        return redirect()->route('club.index')->with('success', "{$data['name']} was added.");
    }

    public function edit(Club $club): View
    {
        return view('admin.clubs.form', ['club' => $club, 'leagues' => League::orderBy('name')->get()]);
    }

    public function update(Request $request, Club $club): RedirectResponse
    {
        $data = $this->validated($request, creating: false);

        $club->update($data + $this->storeImages($request, ['image']));

        return redirect()->route('club.index')->with('success', "{$club->name} was updated.");
    }

    public function destroy(Club $club): RedirectResponse
    {
        if (Jersey::where('club_id', $club->id)->exists()) {
            return back()->with('error', "{$club->name} still has jerseys. Move or delete them first.");
        }

        $club->delete();

        return redirect()->route('club.index')->with('success', "{$club->name} was deleted.");
    }

    private function validated(Request $request, bool $creating): array
    {
        return collect($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'league_id' => ['required', 'integer', 'exists:leagues,id'],
            'image' => $this->imageRules($creating),
        ], [], ['league_id' => 'league', 'image' => 'crest']))->except('image')->all();
    }
}
