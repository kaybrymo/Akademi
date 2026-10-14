<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;

class ReviewController extends Controller {
    public function index($id) {
        return response()->json(Review::where('tutor_id', $id)->get());
    }
    public function store(Request $request) {
        $data = $request->validate([
            'tutor_id' => 'required|exists:users,id',
            'session_id' => 'required|exists:sessions,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);
        $review = $request->user()->reviews()->create($data);
        return response()->json($review, 201);
    }
}
