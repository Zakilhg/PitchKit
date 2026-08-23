<?php

namespace Tests\Feature;

use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_catalog_returns_active_jerseys_with_relationships(): void
    {
        [$jersey] = $this->createCatalog();

        Jersey::create([
            'name' => 'Hidden sample',
            'quantity' => 1,
            'price' => 40,
            'image' => 'hidden.jpg',
            'brand_id' => $jersey->brand_id,
            'club_id' => $jersey->club_id,
            'league_id' => $jersey->league_id,
            'is_active' => false,
        ]);

        $this->getJson('/api/jerseys')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Home jersey')
            ->assertJsonPath('data.0.brand.name', 'Pitch')
            ->assertJsonPath('data.0.club.name', 'Atlas FC')
            ->assertJsonStructure(['data', 'links', 'meta']);
    }

    public function test_the_catalog_can_be_searched(): void
    {
        $this->createCatalog();

        $this->getJson('/api/jerseys?search=home')
            ->assertOk()
            ->assertJsonCount(1, 'data');

        $this->getJson('/api/jerseys?search=away')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_a_single_jersey_uses_route_model_binding(): void
    {
        [$jersey] = $this->createCatalog();

        $this->getJson('/api/jerseys/'.$jersey->id)
            ->assertOk()
            ->assertJsonPath('data.id', $jersey->id)
            ->assertJsonPath('data.images.0', 'home.jpg');

        $this->getJson('/api/jerseys/999999')->assertNotFound();
    }

    private function createCatalog(): array
    {
        $league = League::create(['name' => 'Premier League', 'image' => 'league.png']);
        $brand = Brand::create(['name' => 'Pitch', 'image' => 'brand.png']);
        $club = Club::create([
            'name' => 'Atlas FC',
            'image' => 'club.png',
            'league_id' => $league->id,
        ]);
        $jersey = Jersey::create([
            'name' => 'Home jersey',
            'description' => 'A modern home football shirt.',
            'quantity' => 12,
            'price' => 89.99,
            'image' => 'home.jpg',
            'image1' => 'home-back.jpg',
            'brand_id' => $brand->id,
            'club_id' => $club->id,
            'league_id' => $league->id,
            'is_active' => true,
        ]);

        return [$jersey, $brand, $club, $league];
    }
}
