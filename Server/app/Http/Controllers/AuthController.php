<?php

namespace App\Http\Controllers;

use App\Models\User;
use Database\Seeders\DemoUserSeeder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\View\View;

class AuthController extends Controller
{
    public function loginB(): View
    {
        // On a local machine with the demo accounts seeded, show them on the
        // login page so the project can be tried without reading the README.
        $demo = (app()->isLocal() || config('app.demo_accounts')) && User::where('email', DemoUserSeeder::ADMIN_EMAIL)->exists()
            ? ['email' => DemoUserSeeder::ADMIN_EMAIL, 'password' => DemoUserSeeder::PASSWORD]
            : null;

        return view('auth.login', compact('demo'));
    }

    public function signin(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withInput($request->only('email', 'remember'))
                ->with('error', "That email and password don't match an account.");
        }

        if (! Auth::user()->isAdmin()) {
            Auth::logout();

            return back()->withInput($request->only('email'))->with('error', 'You are not an admin');
        }

        $request->session()->regenerate();

        return redirect()->intended(route('welcome'));
    }

    public function logoutB(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('auth.login')->with('success', 'You have been logged out.');
    }
}
