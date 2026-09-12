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
        Schema::create('course_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // អ្នកវាយតម្លៃ
            $table->foreignId('course_id')->constrained()->cascadeOnDelete(); // ខ្សូស
            $table->unsignedTinyInteger('rating'); // ពិន្ទុ (១ ដល់ ៥)
            $table->text('comment')->nullable(); // មតិយោបល់
            $table->timestamps();
            $table->unique(['user_id', 'course_id']); // ម្នាក់វាយតម្លៃបានតែ ១ ដងប៉ុណ្ណោះក្នុង ១ ខ្សូស
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_reviews');
    }
};
