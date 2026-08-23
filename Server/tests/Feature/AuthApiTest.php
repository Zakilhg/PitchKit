<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_customer_can_register_and_receive_an_api_token(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'username' => 'newfan',
            'first_name' => 'New',
            'last_name' => 'Fan',
            'email' => 'fan@example.com',
            'password' => 'strong-password',
            'password_confirmation' => 'strong-password',
        ]);

        $response
            ->assertCreated()
            ->assertJsonPath('data.user.username', 'newfan')
            ->assertJsonStructure(['data' => ['user' => ['id', 'email'], 'token']]);

        $user = User::where('email', 'fan@example.com')->firstOrFail();

        $this->assertTrue(Hash::check('strong-password', $user->password));
        $this->assertSame('user', $user->role);
    }

    public function test_a_customer_can_log_in_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'email' => 'fan@example.com',
            'password' => Hash::make('strong-password'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'fan@example.com',
            'password' => 'strong-password',
        ]);

        $response
            ->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonStructure(['data' => ['user', 'token']]);
    }

    public function test_invalid_credentials_do_not_disclose_account_details(): void
    {
        User::factory()->create(['email' => 'fan@example.com']);

        $this->postJson('/api/auth/login', [
            'email' => 'fan@example.com',
            'password' => 'incorrect-password',
        ])->assertUnprocessable();
    }

    public function test_profile_routes_require_authentication(): void
    {
        $this->getJson('/api/profile')->assertUnauthorized();
        $this->putJson('/api/profile', ['city' => 'Casablanca'])->assertUnauthorized();
    }

    public function test_a_customer_can_log_out_the_current_api_token(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-client')->plainTextToken;

        $this->withToken($token)
            ->postJson('/api/auth/logout')
            ->assertOk()
            ->assertJsonPath('message', 'Logged out successfully.');

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
