<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('talentId')->unique();
            $table->unsignedBigInteger('adminId');
            $table->string('flag');
            $table->string('flagSender');
            $table->text('lastMessage');
            $table->timestamps();
            $table->foreign('talentId')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('adminId')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chats');
    }
};
