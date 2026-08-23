<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function loginB()
    {
        return view('auth.login');
    }

    public function signin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($request->only('email', 'password'))) {
            if (auth()->user()->role === 'admin') {
                $request->session()->regenerate();
                return redirect()->route('welcome')->with('success', 'You are logged in');
            }

            Auth::logout();
            return back()->with('error', 'You are not an admin');
        }

        return back()->with('error', 'Invalid information');
    }



    public function logoutB(Request $request)
    {
        $request->session()->flush();
        Auth::logout();

        return redirect()->route('auth.login')->with('success', 'User logged out successfully');
    }

}
