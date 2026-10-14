<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller {
    public function index(Request $request) {
        return response()->json($request->user()->notifications);
    }
    public function markRead(Request $request, $id) {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->update(['read_at' => now()]);
        return response()->json(['message' => 'Marked read']);
    }
    public function markAllRead(Request $request) {
        $request->user()->notifications()->update(['read_at' => now()]);
        return response()->json(['message' => 'All marked read']);
    }
}
