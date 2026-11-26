<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('discount_codes', function (Blueprint $table) {
            $table->id();
            $table->string('code', 32)->unique(); // stored upper-case
            $table->string('type', 20);           // percent | fixed | free_shipping
            $table->unsignedInteger('value');     // percent (1-100) or cents
            $table->unsignedInteger('min_subtotal_cents')->default(0);
            $table->unsignedInteger('max_uses')->nullable();
            $table->unsignedInteger('used_count')->default(0);
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::table('orders', function (Blueprint $table) {
            // The code text and amount are copied onto the order, so editing or
            // deleting a code never changes what a customer was charged.
            $table->foreignId('discount_code_id')->nullable()->after('shipping_cents')->constrained()->nullOnDelete();
            $table->string('discount_code', 32)->nullable()->after('discount_code_id');
            $table->unsignedInteger('discount_cents')->default(0)->after('discount_code');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('discount_code_id');
            $table->dropColumn(['discount_code', 'discount_cents']);
        });
        Schema::dropIfExists('discount_codes');
    }
};
