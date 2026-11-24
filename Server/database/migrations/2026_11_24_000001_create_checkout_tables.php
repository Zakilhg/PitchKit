<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/*
 * Real checkout: stock per size, orders that snapshot what was bought, and
 * the removal of the original unused orders/factures tables.
 */
return new class extends Migration
{
    private const SIZES = ['S', 'M', 'L', 'XL'];

    public function up(): void
    {
        Schema::dropIfExists('factures');
        Schema::dropIfExists('orders');

        Schema::create('jersey_sizes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jersey_id')->constrained()->cascadeOnDelete();
            $table->string('size', 4);
            $table->unsignedInteger('stock')->default(0);
            $table->timestamps();
            $table->unique(['jersey_id', 'size']);
        });

        // Spread each jersey's existing total across the sizes so no stock is lost.
        foreach (DB::table('jerseys')->select('id', 'quantity')->get() as $jersey) {
            foreach (self::split((int) $jersey->quantity) as $size => $stock) {
                DB::table('jersey_sizes')->insert([
                    'jersey_id' => $jersey->id,
                    'size' => $size,
                    'stock' => $stock,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('public_token', 40)->unique();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('status', 20)->index();
            $table->string('email');
            $table->string('name');
            $table->json('shipping_address');
            $table->unsignedInteger('subtotal_cents');
            $table->unsignedInteger('shipping_cents');
            $table->unsignedInteger('total_cents');
            $table->string('currency', 3)->default('usd');
            $table->string('gateway', 20);
            $table->string('gateway_ref')->nullable()->index();
            $table->boolean('needs_attention')->default(false);
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('fulfilled_at')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('jersey_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->string('image')->nullable();
            $table->string('size', 4);
            $table->unsignedInteger('unit_price_cents');
            $table->unsignedInteger('quantity');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('jersey_sizes');
    }

    /** @return array<string, int> M and L get the remainder first: they sell most. */
    public static function split(int $total): array
    {
        $total = max(0, $total);
        $base = intdiv($total, 4);
        $stock = array_fill_keys(self::SIZES, $base);
        foreach (array_slice(['M', 'L', 'S', 'XL'], 0, $total % 4) as $size) {
            $stock[$size]++;
        }

        return $stock;
    }
};
