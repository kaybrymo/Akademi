<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class TutorController extends Controller {
    public function index(Request $request) {
        $query = User::where('role', 'tutor')->with('tutorProfile');
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        return response()->json($query->paginate(15));
    }
    public function show($id) {
        $tutor = User::with(['tutorProfile', 'subjects', 'reviews'])->findOrFail($id);
        return response()->json($tutor);
    }
    public function availability($id) {
        $tutor = User::findOrFail($id);
        return response()->json($tutor->schedules ?? []);
    }
}
