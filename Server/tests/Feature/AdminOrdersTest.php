<?php

namespace Tests\Feature;

use App\Checkout\Checkout;
use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminOrdersTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Jersey $jersey;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $league = League::create(['name' => 'Serie A', 'image' => 'serie-a.png']);
        $brand = Brand::create(['name' => 'Puma', 'image' => 'puma.png']);
        $club = Club::create(['name' => 'AC Milan', 'image' => 'milan.png', 'league_id' => $league->id]);
        $this->jersey = Jersey::create([
            'name' => 'AC Milan Home Jersey',
            'price' => 79.99,
            'image' => 'milan.jpg',
            'brand_id' => $brand->id,
            'club_id' => $club->id,
            'league_id' => $league->id,
            'is_active' => true,
        ]);
        $this->jersey->setStock(['S' => 5, 'M' => 5, 'L' => 5, 'XL' => 5]);
    }

    private function order(int $quantity = 1): Order
    {
        return app(Checkout::class)->place(
            [['jersey_id' => $this->jersey->id, 'size' => 'M', 'quantity' => $quantity]],
            ['email' => 'buyer@example.test', 'name' => 'Ada Buyer', 'address' => [
                'line1' => '9 Test Road', 'city' => 'Testville', 'postal_code' => '12345', 'country' => 'IT',
            ]],
            null,
        )['order'];
    }

    public function test_paid_orders_show_up_with_revenue_on_the_dashboard(): void
    {
        app(Checkout::class)->markPaid($this->order(2));

        $this->actingAs($this->admin)->get('/admin')
            ->assertOk()
            ->assertSee('$159.98')
            ->assertSee('PK-00001')
            ->assertSee('To ship');
    }

    public function test_the_orders_list_filters_and_searches(): void
    {
        $paid = app(Checkout::class)->markPaid($this->order());
        $pending = $this->order();

        $this->actingAs($this->admin)->get('/admin/order?status=paid')
            ->assertOk()
            ->assertSee($paid->reference())
            ->assertDontSee($pending->reference());

        $this->actingAs($this->admin)->get('/admin/order?search=PK-'.$pending->id)
            ->assertOk()
            ->assertSee($pending->reference())
            ->assertDontSee($paid->reference());
    }

    public function test_an_order_page_shows_items_customer_and_address(): void
    {
        $order = $this->order(3);

        $this->actingAs($this->admin)->get("/admin/order/{$order->id}")
            ->assertOk()
            ->assertSee('AC Milan Home Jersey')
            ->assertSee('Size M · 3 ×', false)
            ->assertSee('Ada Buyer')
            ->assertSee('9 Test Road')
            ->assertSee('Guest checkout');
    }

    public function test_paid_orders_can_be_marked_as_shipped(): void
    {
        $order = app(Checkout::class)->markPaid($this->order());

        $this->actingAs($this->admin)->post("/admin/order/{$order->id}/fulfil")->assertRedirect();

        $this->assertSame('fulfilled', $order->fresh()->status);
        $this->assertNotNull($order->fresh()->fulfilled_at);
    }

    public function test_cancelling_a_pending_order_from_the_admin_restocks_it(): void
    {
        $order = $this->order(2);
        $this->assertSame(3, $this->jersey->fresh('sizes')->stockBySize()['M']);

        $this->actingAs($this->admin)->post("/admin/order/{$order->id}/cancel")->assertRedirect();

        $this->assertSame('cancelled', $order->fresh()->status);
        $this->assertSame(5, $this->jersey->fresh('sizes')->stockBySize()['M']);
    }

    public function test_customers_cannot_see_admin_orders(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'user']))
            ->get('/admin/order')
            ->assertRedirect(route('auth.login'));
    }
}
