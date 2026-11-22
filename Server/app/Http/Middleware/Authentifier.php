<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class Authentifier
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // Customers also have accounts, so being logged in isn't enough.
        if (Auth::user()?->isAdmin()) {
            return $next($request);
        }

        return redirect()->route('auth.login')->with('error', 'You are not logged in.');
    }
}
