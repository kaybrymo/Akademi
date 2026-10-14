<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class WalletController extends Controller {
    public function balance(Request $request) {
        return response()->json($request->user()->wallet);
    }
    public function transactions(Request $request) {
        return response()->json($request->user()->wallet->transactions()->paginate(15));
    }
    public function deposit(Request $request) {
        return response()->json(['message' => 'Deposit initiated']);
    }
    public function verifyDeposit(Request $request) {
        return response()->json(['message' => 'Deposit verified']);
    }
    public function withdraw(Request $request) {
        return response()->json(['message' => 'Withdraw requested']);
    }
}
