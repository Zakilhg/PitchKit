<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use MongoDB\Driver\Session;

class AuthController extends Controller
{
    /**
     * Create User
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        try {
            $this->validate($request, [
                'username' => 'required',
                'email' => 'required|email|unique:users,email',
                'password' => 'required'
            ]);

            $user = User::create([
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'image' => 'default.jpg'
            ]);

            return response()->json([
                'status' => true,
                'message' => 'User Created Successfully',
                'token' => $user->createToken("API TOKEN")->plainTextToken
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }

    /**
     * Login The User
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            $this->validate($request, [
                'email' => 'required|email',
                'password' => 'required'
            ]);

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return response()->json([
                    'status' => false,
                    'message' => 'Email & Password does not match with our record.',
                ], 401);
            }

            $user = User::where('email', $request->email)->first();

            return response()->json([
                'status' => true,
                'message' => 'User Logged In Successfully',
                'id' => $user->id
            ], 200);

        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage()
            ], 500);
        }
    }


    public function logout($id)
    {
        Session::flush($id);
        Auth::logout();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }


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
