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
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type')->default('Full Time');
            $table->date('kontrakStart');
            $table->date('kontrakEnd');
            $table->unsignedBigInteger('gajiLower');
            $table->unsignedBigInteger('gajiUpper');
            $table->unsignedInteger('kuota');
            $table->unsignedInteger('hired')->default(0);
            $table->date('latestApplyDate');
            $table->text('thumbnail');
            $table->text('description');
            $table->text('whyJoin');
            $table->text('willDo');
            $table->text('requirements');
            $table->text('offer');
            $table->string('status')->nullable()->default('Vacant');
            $table->unsignedBigInteger('clientId');
            $table->foreign('clientId')->references('id')->on('clients');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
    }
};
