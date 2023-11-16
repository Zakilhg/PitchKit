<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function getUser($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    public function updateUser($id, Request $request) {
        $user = User::findOrFail($id);

        $user->first_name = $request->input('first_name');
        $user->last_name = $request->input('last_name');
        $user->adresse = $request->input('adresse');
        $user->city = $request->input('city');
        $user->code_postale = $request->input('code_postale');
        $user->country = $request->input('country');

        if ($request->hasFile('image'))
        {
            $image = $request->file('image');
            $filename = $image->getClientOriginalName();
            $image->move('profile', $filename);
            $user->image = $filename;
            return response()->json('success', 200);
        }

        $user->save();
    }
}
