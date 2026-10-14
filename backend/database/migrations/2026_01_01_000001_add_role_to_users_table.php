<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['student', 'tutor', 'admin'])->default('student');
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['role', 'phone', 'avatar', 'bio', 'location']);
        });
    }
};
