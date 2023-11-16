<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\Http\Request;

class JerseyController extends Controller
{
    /**
     * Display a listing of the resource.
     */

    public function apiJersey()
    {
        $jerseys = Jersey::with('brand')->get();

        $formattedJerseys = $jerseys->map(function ($jersey) {
            return [
                'id' => $jersey->id,
                'image' => $jersey->image,
                'image1' => $jersey->image1,
                'image2' => $jersey->image2,
                'name' => $jersey->name,
                'quantity' => $jersey->quantity,
                'price' => $jersey->price,
                'brand_image' => $jersey->brand->image,

            ];
        });

        return response()->json($formattedJerseys);
    }




    public function index()
    {
        $jerseys = Jersey::paginate(10);
        return view('Jersey.index', compact('jerseys'));
    }


    /**php
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clubs = Club::all();
        $leagues = League::all();
        $brands  = Brand::all();
        return view('Jersey.create',compact('clubs','leagues', 'brands'));

    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the incoming request data
        $validatedData = $request->validate([
            'jersey_name' => 'required',
            'jersey_image1' => 'required|image',
            'jersey_image2' => 'required|image',
            'jersey_image3' => 'required|image',
            'club_id' => 'required|integer',
            'brand_id' => 'required|integer',
            'league_id' => 'required|integer',
            'price' => 'required|numeric',
            'quantity' => 'required|integer',
        ]);

        // Save the new jersey to the database
        $jersey = new Jersey;
        $jersey->name = $validatedData['jersey_name'];
        $jersey->club_id = $validatedData['club_id'];
        $jersey->brand_id = $validatedData['brand_id'];
        $jersey->league_id = $validatedData['league_id'];
        $jersey->price = $validatedData['price'];
        $jersey->quantity = $validatedData['quantity'];

        // Handle the jersey image upload
        if ($request->hasFile('jersey_image1'))
        {
            $image = $request->file('jersey_image1');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $jersey->image = $filename;
        }
        if ($request->hasFile('jersey_image2'))
        {
            $image = $request->file('jersey_image2');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $jersey->image1 = $filename;
        }
        if ($request->hasFile('jersey_image3'))
        {
            $image = $request->file('jersey_image3');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $jersey->image2 = $filename;
        }

        $jersey->save();

        return redirect()->route('jersey.index')->with('success', 'New Jersey has been created successfully');
    }


    /**
     * Display the specified resource.
     */
    public function show($jerseyId)
    {
        // Fetch jersey information
        $jersey = Jersey::find($jerseyId);

        // Fetch the associated brand using the brand_id
        $brand = Brand::find($jersey->brand_id);
        $club = Club::find($jersey->club_id);
        $league = League::find($jersey->league_id);

        // Include only the necessary information in the jersey response
        $jerseyData = [
            'id' => $jersey->id,
            'image' => $jersey->image,
            'image1' => $jersey->image1,
            'image2' => $jersey->image2,
            'name' => $jersey->name,
            'quantity' => $jersey->quantity,
            'price' => $jersey->price,
            'brand_image' => $brand->image,
            'brand_name' => $brand->name,
            'league_name' => $league->name,
            'club_name' => $club->name
        ];

        // Return a JSON response
        return response()->json($jerseyData);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Jersey $jersey)
    {
        $clubs = Club::all();

        $leagues = League::all();
        $brands  = Brand::all();
        return view('Jersey.edit',compact('jersey','clubs','leagues', 'brands'));

    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $jersey = Jersey::findOrFail($id);


        // Handle the jersey image upload
        if ($request->hasFile('jersey_image1'))
        {
            $image = $request->file('jersey_image1');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $jersey->image = $filename;
        }
        if ($request->hasFile('jersey_image2'))
        {
            $image = $request->file('jersey_image2');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $jersey->image1 = $filename;
        }
        if ($request->hasFile('jersey_image3'))
        {
            $image = $request->file('jersey_image3');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $jersey->image2 = $filename;
        }

        $jersey->save();

        return redirect()->route('jersey.index')->with('success', 'New Jersey has been created successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Jersey $jersey)
    {
        $jersey->delete();
        return redirect()->route('jersey.index')->with('success', 'Jersey has been deleted successfully');
    }

}
