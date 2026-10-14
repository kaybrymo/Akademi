<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('subjects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('subject_group_id')->constrained('subject_groups')->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('rate_per_session', 8, 2);
            $table->string('thumbnail')->nullable();
            $table->enum('status', ['active', 'archived'])->default('active');
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('subjects'); }
};
