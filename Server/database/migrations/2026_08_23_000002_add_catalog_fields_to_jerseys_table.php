<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('jerseys', function (Blueprint $table) {
            $table->text('description')->nullable();
            $table->string('image1')->nullable();
            $table->string('image2')->nullable();
            $table->boolean('is_active')->default(true)->index();
            $table->index('brand_id');
            $table->index('club_id');
            $table->index('league_id');
        });
    }

    public function down(): void
    {
        Schema::table('jerseys', function (Blueprint $table) {
            $table->dropIndex(['is_active']);
            $table->dropIndex(['brand_id']);
            $table->dropIndex(['club_id']);
            $table->dropIndex(['league_id']);
            $table->dropColumn(['description', 'image1', 'image2', 'is_active']);
        });
    }
};
