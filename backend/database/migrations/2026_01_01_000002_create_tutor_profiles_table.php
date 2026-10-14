<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('tutor_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('experience_level', ['beginner', 'intermediate', 'advanced', 'expert']);
            $table->boolean('verification_badge')->default(false);
            $table->integer('total_sessions')->default(0);
            $table->decimal('avg_rating', 3, 2)->default(0);
            $table->json('languages')->nullable();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('tutor_profiles'); }
};
