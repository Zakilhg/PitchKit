<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Local demo data: the sample catalog plus a test admin and customer.
     * Run with `php artisan db:seed`.
     */
    public function run(): void
    {
        $this->call([
            DemoCatalogSeeder::class,
            DemoUserSeeder::class,
        ]);
    }
}
