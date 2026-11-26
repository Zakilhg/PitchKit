<?php

namespace Database\Seeders;

use App\Models\DiscountCode;
use Illuminate\Database\Seeder;

/** Codes visitors can try on the demo store (listed in the README). */
class DemoDiscountCodeSeeder extends Seeder
{
    public function run(): void
    {
        $codes = [
            ['code' => 'WELCOME10', 'type' => DiscountCode::PERCENT, 'value' => 10],
            ['code' => 'FREESHIP', 'type' => DiscountCode::FREE_SHIPPING, 'value' => 0],
            ['code' => 'PITCH20', 'type' => DiscountCode::FIXED, 'value' => 2000, 'min_subtotal_cents' => 15000],
        ];

        foreach ($codes as $code) {
            DiscountCode::updateOrCreate(['code' => $code['code']], $code + ['is_active' => true]);
        }
    }
}
