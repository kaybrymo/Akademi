<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('tutoring_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_id')->constrained('subjects')->onDelete('cascade');
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('set null');
            $table->enum('session_type', ['one_on_one', 'group'])->default('one_on_one');
            $table->string('title');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('capacity')->default(1);
            $table->integer('enrolled_count')->default(0);
            $table->decimal('price', 8, 2);
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('tutoring_sessions'); }
};
