<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('session_id')->constrained('tutoring_sessions')->onDelete('cascade');
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            $table->tinyInteger('rating');
            $table->text('comment')->nullable();
            $table->boolean('is_flagged')->default(false);
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('reviews'); }
};
