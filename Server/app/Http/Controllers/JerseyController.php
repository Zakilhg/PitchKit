<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\StoresCatalogImages;
use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class JerseyController extends Controller
{
    use StoresCatalogImages;

    private const IMAGES = ['image', 'image1', 'image2'];

    public function index(Request $request): View
    {
        $search = trim((string) $request->query('search'));

        $jerseys = Jersey::with(['brand', 'club', 'league'])
            ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return view('admin.jerseys.index', compact('jerseys', 'search'));
    }

    public function create(): View
    {
        return view('admin.jerseys.form', $this->formData(new Jersey(['is_active' => true])));
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, creating: true);

        Jersey::create($data + $this->storeImages($request, self::IMAGES));

        return redirect()->route('jersey.index')->with('success', "{$data['name']} was added.");
    }

    public function edit(Jersey $jersey): View
    {
        return view('admin.jerseys.form', $this->formData($jersey));
    }

    public function update(Request $request, Jersey $jersey): RedirectResponse
    {
        $data = $this->validated($request, creating: false);

        $jersey->update($data + $this->storeImages($request, self::IMAGES));

        return redirect()->route('jersey.index')->with('success', "{$jersey->name} was updated.");
    }

    public function destroy(Jersey $jersey): RedirectResponse
    {
        $jersey->delete();

        return redirect()->route('jersey.index')->with('success', "{$jersey->name} was deleted.");
    }

    private function validated(Request $request, bool $creating): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:2000'],
            'price' => ['required', 'numeric', 'min:0', 'max:9999'],
            'quantity' => ['required', 'integer', 'min:0'],
            'brand_id' => ['required', 'integer', 'exists:brands,id'],
            'club_id' => ['required', 'integer', 'exists:clubs,id'],
            'league_id' => ['required', 'integer', 'exists:leagues,id'],
            'image' => $this->imageRules($creating),
            'image1' => $this->imageRules(false),
            'image2' => $this->imageRules(false),
        ], [], [
            'brand_id' => 'brand',
            'club_id' => 'club',
            'league_id' => 'league',
            'quantity' => 'stock',
            'image' => 'main photo',
            'image1' => 'second photo',
            'image2' => 'third photo',
        ]);

        $data['is_active'] = $request->boolean('is_active');

        return collect($data)->except(self::IMAGES)->all();
    }

    private function formData(Jersey $jersey): array
    {
        return [
            'jersey' => $jersey,
            'brands' => Brand::orderBy('name')->get(),
            'clubs' => Club::orderBy('name')->get(),
            'leagues' => League::orderBy('name')->get(),
        ];
    }
}
