<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DemoUserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DemoUserSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_the_demo_admin_can_log_in_to_the_admin_panel(): void
    {
        $this->seed(DemoUserSeeder::class);

        $this->post('/login', [
            'email' => DemoUserSeeder::ADMIN_EMAIL,
            'password' => DemoUserSeeder::PASSWORD,
        ])->assertRedirect(route('welcome'));

        $this->assertAuthenticated();
        $this->assertTrue(auth()->user()->isAdmin());
    }

    public function test_the_demo_customer_can_get_an_api_token_but_not_the_admin_panel(): void
    {
        $this->seed(DemoUserSeeder::class);

        $this->postJson('/api/auth/login', [
            'email' => DemoUserSeeder::CUSTOMER_EMAIL,
            'password' => DemoUserSeeder::PASSWORD,
        ])->assertOk()->assertJsonStructure(['data' => ['token']]);

        $this->assertFalse(User::where('email', DemoUserSeeder::CUSTOMER_EMAIL)->first()->isAdmin());
    }

    public function test_production_skips_the_demo_accounts_by_default(): void
    {
        $this->app['env'] = 'production';

        // Called directly: db:seed would stop to confirm a production run.
        $this->app->make(DemoUserSeeder::class)->run();

        $this->assertSame(0, User::count());
        $this->get('/login')->assertOk()->assertDontSee(DemoUserSeeder::ADMIN_EMAIL);
    }

    public function test_a_public_demo_can_turn_the_demo_accounts_on(): void
    {
        $this->app['env'] = 'production';
        config(['app.demo_accounts' => true]);

        $this->app->make(DemoUserSeeder::class)->run();

        $this->assertSame(2, User::count());
        $this->get('/login')->assertOk()
            ->assertSee(DemoUserSeeder::ADMIN_EMAIL)
            ->assertSee(DemoUserSeeder::PASSWORD);
    }

    public function test_seeding_twice_keeps_one_account_each(): void
    {
        $this->seed(DemoUserSeeder::class);
        $this->seed(DemoUserSeeder::class);

        $this->assertSame(2, User::count());
    }
}
