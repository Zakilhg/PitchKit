<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_bare_root_forwards_to_the_admin(): void
    {
        $this->get('/')->assertRedirect('/admin');
        $this->get('/login')->assertRedirect('/admin/login');
    }

    public function test_guests_are_redirected_to_the_admin_login(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect(route('auth.login'));
    }
}
