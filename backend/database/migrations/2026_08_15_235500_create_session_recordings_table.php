<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('session_recordings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('session_id')->constrained('tutoring_sessions')->onDelete('cascade');
            $table->foreignId('tutor_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->string('video_url');
            $table->string('thumbnail_url')->nullable();
            $table->integer('duration_seconds')->default(0);
            $table->decimal('size_mb', 8, 2)->default(0.00);
            $table->timestamp('recorded_at')->useCurrent();
            $table->timestamp('expires_at')->nullable(); // Default 10 days from recorded_at
            $table->boolean('is_kept')->default(false); // Tutor elected to retain beyond 10 days
            $table->decimal('monthly_storage_fee', 8, 2)->default(1500.00); // Charged to tutor if kept
            $table->timestamp('last_billed_at')->nullable();
            $table->enum('status', ['active', 'extended', 'purged', 'deleted'])->default('active');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('session_recordings');
    }
};
