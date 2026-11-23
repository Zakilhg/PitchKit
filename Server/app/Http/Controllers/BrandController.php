<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\StoresCatalogImages;
use App\Models\Brand;
use App\Models\Jersey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class BrandController extends Controller
{
    use StoresCatalogImages;

    public function apiBrand()
    {
        return Brand::all();
    }

    public function index(): View
    {
        $brands = Brand::orderBy('name')->get();
        $counts = Jersey::selectRaw('brand_id, count(*) as total')->groupBy('brand_id')->pluck('total', 'brand_id');

        return view('admin.brands.index', compact('brands', 'counts'));
    }

    public function create(): View
    {
        return view('admin.brands.form', ['brand' => new Brand]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request, creating: true);

        Brand::create($data + $this->storeImages($request, ['image']));

        return redirect()->route('brand.index')->with('success', "{$data['name']} was added.");
    }

    public function edit(Brand $brand): View
    {
        return view('admin.brands.form', compact('brand'));
    }

    public function update(Request $request, Brand $brand): RedirectResponse
    {
        $data = $this->validated($request, creating: false);

        $brand->update($data + $this->storeImages($request, ['image']));

        return redirect()->route('brand.index')->with('success', "{$brand->name} was updated.");
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if (Jersey::where('brand_id', $brand->id)->exists()) {
            return back()->with('error', "{$brand->name} still has jerseys. Move or delete them first.");
        }

        $brand->delete();

        return redirect()->route('brand.index')->with('success', "{$brand->name} was deleted.");
    }

    private function validated(Request $request, bool $creating): array
    {
        return collect($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'image' => $this->imageRules($creating),
        ], [], ['image' => 'logo']))->except('image')->all();
    }
}
