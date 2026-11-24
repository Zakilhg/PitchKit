<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use Illuminate\Database\Seeder;

/**
 * Fills the store with the demo catalog the GitHub Pages build uses
 * (Client/src/demo/catalog.json). Images already live in public/images.
 * Safe to run more than once.
 */
class DemoCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = json_decode(
            file_get_contents(base_path('../Client/src/demo/catalog.json')),
            true,
            flags: JSON_THROW_ON_ERROR,
        );

        $brands = collect($catalog['brands'])->mapWithKeys(fn ($brand) => [
            $brand['name'] => Brand::updateOrCreate(['name' => $brand['name']], ['image' => $brand['image']]),
        ]);

        $leagues = collect($catalog['leagues'])->mapWithKeys(fn ($league) => [
            $league['name'] => League::updateOrCreate(['name' => $league['name']], ['image' => $league['image']]),
        ]);

        $clubs = collect($catalog['clubs'])->mapWithKeys(fn ($club) => [
            $club['name'] => Club::updateOrCreate(['name' => $club['name']], [
                'image' => $club['image'],
                'league_id' => $leagues[$club['league']]->id,
            ]),
        ]);

        foreach ($catalog['jerseys'] as $jersey) {
            $club = $clubs[$jersey['club']];

            $model = Jersey::updateOrCreate(['name' => $jersey['name']], [
                'description' => $jersey['description'] ?? null,
                'price' => $jersey['price'],
                'image' => $jersey['images'][0],
                'image1' => $jersey['images'][1] ?? null,
                'image2' => $jersey['images'][2] ?? null,
                'brand_id' => $brands[$jersey['brand']]->id,
                'club_id' => $club->id,
                'league_id' => $club->league_id,
                'is_active' => true,
            ]);
            $model->setStock(Jersey::splitStock((int) $jersey['quantity']));
        }
    }
}
