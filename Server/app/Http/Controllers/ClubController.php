<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\League;
use Illuminate\Http\Request;

class ClubController extends Controller
{

    public function apiClub() {
        return Club::all();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $clubs = Club::paginate(20);

        return view ('club.index',compact('clubs'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $leagues = League::all();
        return view('club.create',compact('leagues'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'club_name' => 'required',
            'club_image' => 'required|image',

        ]);

        // Save the new Club to the database
        $club = new Club;
        $club->name = $validatedData['club_name'];

        // Handle the club image upload
        if ($request->hasFile('club_image'))
        {
            $image = $request->file('club_image');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $club->image = $filename;
        }

        $club->save();

        return redirect()->route('club.index')->with('success', 'New Jersey has been created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Club $club)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Club $club)
    {
        $leagues = League::all();
        return view('club.edit',compact("club",'leagues'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $club = Club::findOrFail($id);
        $club->name = $request->input('club_name');
        $club->league_id = $request->input('league_id');

        if ($request->hasFile('club_image'))
        {
            // delete old image
            $old_image = $club->image;
            if ($old_image) {
                $old_image_path = public_path('images/'.$old_image);
                if (file_exists($old_image_path)) {
                    unlink($old_image_path);
                }
            }

            // save new image
            $image = $request->file('club_image');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $club->image = $filename;
        }

        $club->save();

        return redirect()->route('club.index')->with('success', 'Club updated successfully!');
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Club $club)
    {
        $club->delete();
        return redirect()->route('club.index')->with('success', 'club has been deleted successfully');
    }
}
