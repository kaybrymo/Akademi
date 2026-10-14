<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->boolean('is_active')->default(false);
            $table->boolean('is_default')->default(false);
            $table->string('public_key')->nullable();
            $table->string('secret_key')->nullable();
            $table->string('webhook_url')->nullable();
            $table->json('extra_config')->nullable();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('payment_gateways'); }
};
