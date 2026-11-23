<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Test accounts for trying the project locally. Never run this on a public server:
 * the password is published in the README.
 */
class DemoUserSeeder extends Seeder
{
    public const ADMIN_EMAIL = 'admin@pitchkit.test';

    public const CUSTOMER_EMAIL = 'fan@pitchkit.test';

    public const PASSWORD = 'pitchkit-demo';

    /** Local machines and tests always get them; a server only with DEMO_ACCOUNTS=true. */
    public static function enabled(): bool
    {
        return app()->environment(['local', 'testing']) || config('app.demo_accounts');
    }

    public function run(): void
    {
        if (! self::enabled()) {
            $this->command?->warn('Skipping demo accounts: set APP_ENV=local or DEMO_ACCOUNTS=true to create them.');

            return;
        }

        $accounts = [
            self::ADMIN_EMAIL => ['username' => 'admin', 'first_name' => 'Demo', 'last_name' => 'Admin', 'role' => 'admin'],
            self::CUSTOMER_EMAIL => ['username' => 'fan', 'first_name' => 'Demo', 'last_name' => 'Fan', 'role' => 'user'],
        ];

        foreach ($accounts as $email => $attributes) {
            User::updateOrCreate(
                ['email' => $email],
                $attributes + ['password' => Hash::make(self::PASSWORD)],
            );
        }
    }
}
