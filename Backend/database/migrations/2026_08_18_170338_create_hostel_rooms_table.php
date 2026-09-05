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
        Schema::create('hostel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_id')->nullable()->constrained('hostels')->onDelete('cascade'); // ភ្ជាប់ទៅអគារ (ស្រេចចិត្ត)
            $table->string('room_number'); // លេខបន្ទប់
            $table->string('block_name')->nullable(); // ឈ្មោះប្លុក
            $table->string('image')->nullable(); // រូបភាពបន្ទប់
            $table->string('type')->default('standard'); // standard, deluxe, ac...
            $table->string('gender')->default('male'); // male ឬ female
            $table->integer('number_of_beds'); // ចំនួនគ្រែសរុប
            $table->decimal('cost_per_bed', 8, 2); // តម្លៃក្នុង១គ្រែ
            $table->string('status')->default('available'); // available, full, maintenance
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hostel_rooms');
    }
};
