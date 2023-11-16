<?php

namespace App\Http\Controllers;

use App\Models\League;
use Illuminate\Http\Request;

class LeagueController extends Controller
{

    public function apiLeague() {
        return League::all();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $leagues = League::all();
        return view('league.index',compact('leagues'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('league.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'league_name' => 'required',
            'league_image' => 'required|image',

        ]);


        $league = new League;
        $league->name = $validatedData['league_name'];


        if ($request->hasFile('league_image'))
        {
            $image = $request->file('league_image');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $league->image = $filename;
        }

        $league->save();

        return redirect()->route('league.index')->with('success', 'New Jersey has been created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(League $league)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(League $league)
    {
        return view('league.edit',compact("league"));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $league = League::findOrFail($id);
        $league->name = $request->input('league_name');

        if ($request->hasFile('league_image'))
        {
            $image = $request->file('league_image');
            $filename = $image->getClientOriginalName();
            $image->move('images', $filename);
            $league->image = $filename;
        }

        $league->save();

        return redirect()->route('league.index')->with('success', 'League updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(League $league)
    {
        $league->delete();
        return redirect()->route('league.index')->with('success', 'League has been deleted successfully');
    }
}
