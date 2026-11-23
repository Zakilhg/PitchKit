<?php

namespace Tests\Feature;

use Database\Seeders\DemoCatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoCatalogSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_demo_catalog_fills_the_store_with_jerseys_whose_images_exist(): void
    {
        $this->seed(DemoCatalogSeeder::class);

        $jerseys = $this->getJson('/api/jerseys')->assertOk()->json('data');

        $this->assertCount(14, $jerseys);
        $barca = collect($jerseys)->firstWhere('name', 'FC Barcelona Home Jersey');
        $this->assertSame('Nike', $barca['brand_name']);
        $this->assertSame('FC Barcelona', $barca['club_name']);
        $this->assertSame('La Liga', $barca['league_name']);
        $this->assertCount(3, $barca['images']);

        foreach ($jerseys as $jersey) {
            foreach ([...$jersey['images'], $jersey['brand_image']] as $file) {
                $this->assertFileExists(public_path('images/'.$file));
            }
        }
    }

    public function test_seeding_twice_does_not_duplicate_the_catalog(): void
    {
        $this->seed(DemoCatalogSeeder::class);
        $this->seed(DemoCatalogSeeder::class);

        $this->assertCount(14, $this->getJson('/api/jerseys')->json('data'));
    }
}
