<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Models\SubjectGroup;
use Illuminate\Http\Request;

class SubjectController extends Controller {
    public function index(Request $request) {
        return response()->json($request->user()->subjects);
    }
    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'subject_group_id' => 'required|exists:subject_groups,id',
            'description' => 'nullable|string',
            'rate_per_session' => 'required|numeric'
        ]);
        $subject = $request->user()->subjects()->create($data);
        return response()->json($subject, 201);
    }
    public function update(Request $request, $id) {
        $subject = $request->user()->subjects()->findOrFail($id);
        $subject->update($request->all());
        return response()->json($subject);
    }
    public function destroy(Request $request, $id) {
        $subject = $request->user()->subjects()->findOrFail($id);
        $subject->update(['status' => 'archived']);
        return response()->json(['message' => 'Archived']);
    }
    public function groups() {
        return response()->json(SubjectGroup::all());
    }
}
