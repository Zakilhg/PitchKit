<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_customers_with_a_session_cannot_open_the_admin_panel(): void
    {
        $customer = User::factory()->create(['role' => 'user']);

        $this->actingAs($customer)->get('/admin/jersey')->assertRedirect(route('auth.login'));
    }

    public function test_admins_can_open_the_admin_panel(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get('/admin/jersey')->assertOk();
    }

    public function test_customers_cannot_log_in_to_the_admin_panel(): void
    {
        $customer = User::factory()->create(['role' => 'user']);

        $this->post('/admin/login', ['email' => $customer->email, 'password' => 'password'])
            ->assertSessionHas('error', 'You are not an admin');

        $this->assertGuest();
    }
}
