<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Session;
use Illuminate\Http\Request;

class SessionController extends Controller {
    public function index(Request $request) {
        $user = $request->user();
        if ($user->isTutor()) {
            return response()->json(Session::where('tutor_id', $user->id)->get());
        }
        return response()->json($user->bookings()->with('session')->get()->pluck('session'));
    }
    public function store(Request $request) {
        $data = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string',
            'date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i',
            'price' => 'required|numeric'
        ]);
        $session = $request->user()->tutorSessions()->create($data);
        return response()->json($session, 201);
    }
    public function show($id) {
        return response()->json(Session::findOrFail($id));
    }
    public function update(Request $request, $id) {
        $session = Session::where('tutor_id', $request->user()->id)->findOrFail($id);
        $session->update($request->all());
        return response()->json($session);
    }
    public function cancel(Request $request, $id) {
        $session = Session::where('tutor_id', $request->user()->id)->findOrFail($id);
        $session->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Cancelled']);
    }
}
