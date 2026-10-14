<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
            'role'     => 'in:student,tutor',
        ]);
        $data['password'] = Hash::make($data['password']);
        $data['role'] = $data['role'] ?? 'student';
        $user = User::create($data);
        // Create wallet
        Wallet::create(['user_id' => $user->id]);
        $token = $user->createToken('auth')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials.']]);
        }
        $token = $user->createToken('auth')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user()->load('wallet', 'tutorProfile'));
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'phone'    => 'sometimes|string',
            'bio'      => 'sometimes|string',
            'location' => 'sometimes|string',
        ]);
        $request->user()->update($data);
        return response()->json($request->user()->fresh());
    }
}
