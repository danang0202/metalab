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
        Schema::create('chat_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('chatId');
            $table->unsignedBigInteger('senderId');
            $table->text('message');
            $table->string('status');
            $table->string('type'); //file atau text
            $table->timestamps();
            $table->foreign('chatId')->references('id')->on('chats')->onDelete('cascade');
            $table->foreign('senderId')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_data');
    }
};
