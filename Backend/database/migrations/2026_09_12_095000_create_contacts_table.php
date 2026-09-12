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
        Schema::create('contacts', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // គណនីអ្នកប្រើប្រាស់ (បើមានចូលគណនីស្រាប់)
            $table->string('name'); // ឈ្មោះអ្នកទាក់ទង
            $table->string('email'); // អ៊ីម៉ែល
            $table->string('subject')->nullable(); // ប្រធានបទសារ
            $table->text('message'); // មាតិកាសារ ឬ សំណូមពរ
            $table->enum('status', ['unread', 'read', 'resolved'])->default('unread'); // ស្ថានភាពសារក្នុងប្រព័ន្ធ Admin
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
