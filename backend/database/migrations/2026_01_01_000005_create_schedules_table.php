<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->tinyInteger('day_of_week');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('session_duration');
            $table->integer('capacity')->default(1);
            $table->boolean('is_available')->default(true);
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('schedules'); }
};
