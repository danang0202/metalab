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
        Schema::create('hirings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('talentId');
            $table->unsignedBigInteger('jobId');
            $table->unsignedBigInteger('firstStageId')->nullable();
            $table->unsignedBigInteger('secondStageId')->nullable();
            $table->unsignedBigInteger('thirdtageId')->nullable();
            $table->unsignedBigInteger('fourthStageId')->nullable();
            $table->foreign('talentId')->references('id')->on('users')->onDelete("cascade");
            $table->foreign('jobId')->references('id')->on('jobs')->onDelete('cascade');
            $table->foreign('firstStageId')->references('id')->on('tahap_satus');
            $table->foreign('secondStageId')->references('id')->on('tahap_tengahs');
            $table->foreign('thirdtageId')->references('id')->on('tahap_tengahs');
            $table->foreign('fourthStageId')->references('id')->on('tahap_empats');
            $table->string('status'); // on progress - hired - completed - reject
            $table->integer('lastStage'); // 1 - 2 - 3 -4 
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hirings');
    }
};
