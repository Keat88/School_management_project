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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // ចំណងជើងខ្សូស
            $table->string('slug')->unique(); // Slug សម្រាប់ URL
            $table->text('description')->nullable(); // ការពិពណ៌នា
            $table->decimal('price', 10, 2)->default(0.00); // តម្លៃ
            $table->decimal('discount_price', 10, 2)->nullable(); // តម្លៃបញ្ចុះ
            $table->string('thumbnail')->nullable(); // រូបភាពតូច (Thumbnail)
            $table->foreignId('category_id')->nullable()->constrained('course_categories')->nullOnDelete(); // ប្រភេទខ្សូស
            $table->foreignId('instructor_id')->constrained('users')->cascadeOnDelete(); // គ្រូបង្រៀន
            $table->enum('level', ['beginner', 'intermediate', 'advanced', 'all'])->default('all'); // កម្រិត
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft'); // ស្ថានភាពខ្សូស
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
