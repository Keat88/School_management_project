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
        Schema::create('inrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // សិស្ស
            $table->foreignId('course_id')->constrained()->cascadeOnDelete(); // ខ្សូស
            $table->foreignId('order_id')->nullable()->constrained()->nullOnDelete(); // ការបញ្ជាទិញ
            $table->integer('progress_percentage')->default(0); // ភាគរយការរៀនចប់
            $table->timestamp('completed_at')->nullable(); // កាលបរិច្ឆេទរៀនចប់
            $table->timestamps();
            $table->unique(['user_id', 'course_id']); // បង្ការការចុះឈ្មោះជាន់គ្នា
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inrollments');
    }
};
