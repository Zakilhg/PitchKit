<?php

namespace Tests\Feature;

use App\Models\DiscountCode;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDiscountCodesTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    private function form(array $overrides = []): array
    {
        return $overrides + [
            'code' => 'summer-20',
            'type' => DiscountCode::PERCENT,
            'value' => '20',
            'min_subtotal' => '',
            'max_uses' => '',
            'expires_at' => '',
            'is_active' => '1',
        ];
    }

    public function test_admins_create_a_code_and_see_it_listed(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/discount-code', $this->form(['min_subtotal' => '50', 'max_uses' => '100', 'expires_at' => '2030-01-31']))
            ->assertRedirect('/admin/discount-code');

        $code = DiscountCode::firstOrFail();
        $this->assertSame('SUMMER-20', $code->code);
        $this->assertSame(20, $code->value);
        $this->assertSame(5000, $code->min_subtotal_cents);
        $this->assertSame(100, $code->max_uses);
        // The last day counts in full.
        $this->assertSame('2030-01-31 23:59:59', $code->expires_at->format('Y-m-d H:i:s'));

        $this->actingAs($this->admin)->get('/admin/discount-code')
            ->assertOk()
            ->assertSee('SUMMER-20')
            ->assertSee('20% off');
    }

    public function test_a_fixed_amount_is_entered_in_dollars_and_stored_in_cents(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/discount-code', $this->form(['code' => 'FIVE', 'type' => DiscountCode::FIXED, 'value' => '5.50']))
            ->assertRedirect();

        $this->assertSame(550, DiscountCode::firstOrFail()->value);
    }

    public function test_codes_are_unique_whatever_the_case(): void
    {
        DiscountCode::create(['code' => 'SUMMER-20', 'type' => DiscountCode::PERCENT, 'value' => 20, 'is_active' => true]);

        $this->actingAs($this->admin)
            ->post('/admin/discount-code', $this->form())
            ->assertSessionHasErrors('code');
    }

    public function test_bad_values_are_refused(): void
    {
        $this->actingAs($this->admin)
            ->post('/admin/discount-code', $this->form(['value' => '120']))
            ->assertSessionHasErrors('value');

        $this->actingAs($this->admin)
            ->post('/admin/discount-code', $this->form(['code' => 'has spaces']))
            ->assertSessionHasErrors('code');

        $this->assertSame(0, DiscountCode::count());
    }

    public function test_admins_edit_and_delete_codes(): void
    {
        $code = DiscountCode::create(['code' => 'OLD', 'type' => DiscountCode::PERCENT, 'value' => 5, 'is_active' => true]);

        $this->actingAs($this->admin)->get("/admin/discount-code/{$code->id}/edit")->assertOk()->assertSee('OLD');

        $this->actingAs($this->admin)
            ->put("/admin/discount-code/{$code->id}", $this->form(['code' => 'OLD', 'value' => '15', 'is_active' => '0']))
            ->assertRedirect('/admin/discount-code');
        $this->assertSame(15, $code->fresh()->value);
        $this->assertFalse($code->fresh()->is_active);

        $this->actingAs($this->admin)->delete("/admin/discount-code/{$code->id}")->assertRedirect('/admin/discount-code');
        $this->assertSame(0, DiscountCode::count());
    }

    public function test_customers_cannot_manage_codes(): void
    {
        $customer = User::factory()->create(['role' => 'user']);

        $this->actingAs($customer)->get('/admin/discount-code')->assertRedirect(route('auth.login'));
        $this->actingAs($customer)->post('/admin/discount-code', $this->form())->assertRedirect(route('auth.login'));
        $this->assertSame(0, DiscountCode::count());
    }
}
