<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            // Optional: the storefront asks for a name and email, not a username.
            'username' => ['nullable', 'string', 'max:50', 'alpha_dash', 'unique:users,username'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'username' => $validated['username'] ?? $this->usernameFor($validated['email']),
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'image' => null,
            'role' => 'user',
        ]);

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $user->createToken($this->tokenName($request))->plainTextToken,
            ],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        return response()->json([
            'data' => [
                'user' => $user,
                'token' => $user->createToken($this->tokenName($request))->plainTextToken,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    /** "sam.lee@example.com" -> "samlee", plus digits if that is taken. */
    private function usernameFor(string $email): string
    {
        $base = Str::limit(preg_replace('/[^a-z0-9]/', '', strtolower(Str::before($email, '@'))) ?: 'fan', 40, '');
        $username = $base;
        while (User::where('username', $username)->exists()) {
            $username = $base.random_int(100, 9999);
        }

        return $username;
    }

    private function tokenName(Request $request): string
    {
        return mb_substr($request->userAgent() ?: 'PitchKit client', 0, 255);
    }
}
