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
        Schema::create('courses_modules', function (Blueprint $table) {

            $table->id();
            $table->foreignId('course_id')->constrained()->cascadeOnDelete(); // ស្គាល់ខ្សូស
            $table->string('title'); // ឈ្មោះជំពូក
            $table->integer('sort_order')->default(0); // លំដាប់បង្ហាញ
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses_modules');
    }
};
