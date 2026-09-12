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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete(); // អតិថិជន
            $table->decimal('total_amount', 10, 2); // ទឹកប្រាក់សរុប
            $table->enum('payment_status', ['pending', 'completed', 'failed', 'refunded'])->default('pending'); // ស្ថានភាពទូទាត់ប្រាក់
            $table->string('payment_method')->nullable(); // វិធីសាស្ត្រទូទាត់ (ABA, Visa, etc.)
            $table->string('transaction_id')->nullable(); // លេខសម្គាល់ប្រតិបត្តិការទូទាត់
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
