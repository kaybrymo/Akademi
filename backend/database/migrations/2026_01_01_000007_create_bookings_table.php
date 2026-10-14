<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('session_id')->constrained('tutoring_sessions')->onDelete('cascade');
            $table->enum('status', ['confirmed', 'pending', 'cancelled', 'rescheduled'])->default('pending');
            $table->enum('payment_status', ['paid', 'unpaid', 'refunded'])->default('unpaid');
            $table->string('payment_reference')->nullable();
            $table->timestamp('booked_at')->useCurrent();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('bookings'); }
};
