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
        Schema::create('hostel_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade'); // ភ្ជាប់ទៅតារាងសិស្ស
            $table->foreignId('hostel_room_id')->constrained('hostel_rooms')->onDelete('cascade'); // ភ្ជាប់ទៅតារាងបន្ទប់
            $table->string('bed_number')->nullable(); // លេខគ្រែ (ឧ. Bed 1)
            $table->date('start_date'); // ថ្ងៃចូលរស់នៅ
            $table->date('end_date')->nullable(); // ថ្ងៃចាកចេញ
            $table->string('status')->default('active'); // active (កំពុងនៅ), checked_out (ចេញរួច)
            $table->timestamps();
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student__hostels');
    }
};
