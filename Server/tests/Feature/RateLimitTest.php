<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Each rate limit must count only its own requests. When they shared one
 * counter per IP, shopping (quotes, checkout, the order page's polling) used up
 * the login allowance, and the next login got "429 Too Many Requests".
 */
class RateLimitTest extends TestCase
{
    use RefreshDatabase;

    private function browseTheCheckout(int $times): void
    {
        for ($i = 0; $i < $times; $i++) {
            $this->postJson('/api/checkout/quote', ['items' => []])->assertUnprocessable();
        }
    }

    public function test_shopping_does_not_use_up_the_customer_login_limit(): void
    {
        $customer = User::factory()->create(['role' => 'user']);

        $this->browseTheCheckout(10);

        $this->postJson('/api/auth/login', ['email' => $customer->email, 'password' => 'password'])
            ->assertOk();
    }

    public function test_shopping_does_not_use_up_the_admin_login_limit(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->browseTheCheckout(10);

        $this->post('/admin/login', ['email' => $admin->email, 'password' => 'password'])
            ->assertRedirect();
        $this->assertAuthenticatedAs($admin);
    }

    public function test_repeated_failed_logins_are_still_limited(): void
    {
        $customer = User::factory()->create(['role' => 'user']);
        $wrong = ['email' => $customer->email, 'password' => 'not-the-password'];

        for ($i = 0; $i < 6; $i++) {
            $this->postJson('/api/auth/login', $wrong)->assertUnprocessable();
        }

        $this->postJson('/api/auth/login', $wrong)->assertTooManyRequests();
    }

    public function test_the_general_api_limit_comes_from_config(): void
    {
        config(['app.api_rate_limit' => 2]);

        $this->getJson('/api/brands')->assertOk();
        $this->getJson('/api/brands')->assertOk();
        $this->getJson('/api/brands')->assertTooManyRequests();
    }

    public function test_repeated_admin_logins_are_still_limited(): void
    {
        $wrong = ['email' => 'admin@pitchkit.test', 'password' => 'not-the-password'];

        for ($i = 0; $i < 5; $i++) {
            $this->post('/admin/login', $wrong)->assertRedirect();
        }

        $this->post('/admin/login', $wrong)->assertTooManyRequests();
    }
}
