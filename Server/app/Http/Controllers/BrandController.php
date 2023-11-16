<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Jersey;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function apiBrand() {
        return Brand::all();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $brands = Brand::all();
        return view('brand.index',compact('brands'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('brand.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'brand_name' => 'required',
            'brand_image' => 'required|image',

        ]);

        // Save the new brand to the database
        $brand = new Brand;
        $brand->name = $validatedData['brand_name'];

        // Handle the brand image upload
        if ($request->hasFile('brand_image'))
        {
            $image = $request->file('brand_image');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $brand->image = $filename;
        }

        $brand->save();

        return redirect()->route('brand.index')->with('success', 'New Jersey has been created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        return view('brand.edit',compact("brand"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $brand = Brand::findOrFail($id);
        $brand->name = $request->input('brand_name');

        if ($request->hasFile('brand_image'))
        {
            $image = $request->file('brand_image');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $brand->image = $filename;
        }

        $brand->save();

        return redirect()->route('brand.index')->with('success', 'Brand updated successfully!');
    }

        /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();
        return redirect()->route('brand.index')->with('success', 'brand has been deleted successfully');
    }
}
