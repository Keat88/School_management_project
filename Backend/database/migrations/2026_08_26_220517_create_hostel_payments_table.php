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
        Schema::create('hostel_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('hostel_room_id')->constrained('hostel_rooms')->onDelete('cascade');
            $table->decimal('amount', 8, 2); // ចំនួនប្រាក់ត្រូវបង់
            $table->string('month'); // ខែដែលត្រូវបង់ (ឧ. March)
            $table->year('year'); // ឆ្នាំ (ឧ. 2026)
            $table->string('status')->default('unpaid'); // paid (បានបង់), unpaid (ជំពាក់)
            $table->date('payment_date')->nullable(); //
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hostel_payments');
    }
};
