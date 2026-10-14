<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('wallet_id')->constrained('wallets')->onDelete('cascade');
            $table->enum('type', ['deposit', 'withdrawal', 'payment', 'earning', 'refund', 'commission']);
            $table->decimal('amount', 12, 2);
            $table->string('description');
            $table->string('reference')->unique()->nullable();
            $table->string('gateway')->nullable();
            $table->enum('status', ['pending', 'completed', 'failed'])->default('completed');
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }
    public function down() { Schema::dropIfExists('transactions'); }
};
