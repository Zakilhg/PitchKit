<?php

namespace Tests\Feature;

use App\Checkout\Checkout;
use App\Models\Brand;
use App\Models\Club;
use App\Models\DiscountCode;
use App\Models\Jersey;
use App\Models\League;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class DiscountCodeTest extends TestCase
{
    use RefreshDatabase;

    private Jersey $jersey;

    protected function setUp(): void
    {
        parent::setUp();

        $league = League::create(['name' => 'La Liga', 'image' => 'la-liga.png']);
        $brand = Brand::create(['name' => 'Nike', 'image' => 'nike.png']);
        $club = Club::create(['name' => 'FC Barcelona', 'image' => 'barca.png', 'league_id' => $league->id]);

        // $89.99 each; shipping is $7.50 under $100.
        $this->jersey = Jersey::create([
            'name' => 'FC Barcelona Home Jersey',
            'price' => 89.99,
            'image' => 'barca1.jpg',
            'brand_id' => $brand->id,
            'club_id' => $club->id,
            'league_id' => $league->id,
            'is_active' => true,
        ]);
        $this->jersey->setStock(['S' => 1, 'M' => 3, 'L' => 0, 'XL' => 2]);
    }

    private function code(array $attributes = []): DiscountCode
    {
        return DiscountCode::create($attributes + [
            'code' => 'WELCOME10',
            'type' => DiscountCode::PERCENT,
            'value' => 10,
            'is_active' => true,
        ]);
    }

    private function items(int $quantity = 1): array
    {
        return [['jersey_id' => $this->jersey->id, 'size' => 'M', 'quantity' => $quantity]];
    }

    private function payload(?string $code, int $quantity = 1): array
    {
        return [
            'items' => $this->items($quantity),
            'code' => $code,
            'email' => 'fan@example.test',
            'name' => 'Test Fan',
            'address' => ['line1' => '1 Test Street', 'city' => 'Testville', 'postal_code' => '00000', 'country' => 'US'],
        ];
    }

    private function place(?string $code): Order
    {
        $token = $this->postJson('/api/checkout', $this->payload($code))->assertCreated()->json('data.order.token');

        return Order::where('public_token', $token)->firstOrFail();
    }

    private function stockInM(): int
    {
        return $this->jersey->fresh('sizes')->stockBySize()['M'];
    }

    public function test_a_percent_code_takes_money_off_the_items(): void
    {
        $this->code();

        // Codes are matched without caring about case or stray spaces.
        $this->postJson('/api/checkout/quote', ['items' => $this->items(), 'code' => ' welcome10 '])
            ->assertOk()
            ->assertJsonPath('data.discount_cents', 900)
            ->assertJsonPath('data.code.code', 'WELCOME10')
            ->assertJsonPath('data.code_error', null)
            ->assertJsonPath('data.total_cents', 8999 - 900 + 750);

        $order = $this->place('welcome10');

        $this->assertSame(900, $order->discount_cents);
        $this->assertSame('WELCOME10', $order->discount_code);
        $this->assertSame(8999 - 900 + 750, $order->total_cents);
        $this->assertSame(1, DiscountCode::first()->used_count);
    }

    public function test_a_fixed_code_never_takes_off_more_than_the_items_cost(): void
    {
        $this->code(['code' => 'TWENTY', 'type' => DiscountCode::FIXED, 'value' => 2000]);
        $this->code(['code' => 'HUGE', 'type' => DiscountCode::FIXED, 'value' => 50000]);

        $this->postJson('/api/checkout/quote', ['items' => $this->items(), 'code' => 'TWENTY'])
            ->assertJsonPath('data.discount_cents', 2000)
            ->assertJsonPath('data.total_cents', 8999 - 2000 + 750);

        $this->postJson('/api/checkout/quote', ['items' => $this->items(), 'code' => 'HUGE'])
            ->assertJsonPath('data.discount_cents', 8999)
            ->assertJsonPath('data.total_cents', 750);
    }

    public function test_a_free_shipping_code_removes_the_shipping_charge(): void
    {
        $this->code(['code' => 'FREESHIP', 'type' => DiscountCode::FREE_SHIPPING, 'value' => 0]);

        $this->postJson('/api/checkout/quote', ['items' => $this->items(), 'code' => 'FREESHIP'])
            ->assertJsonPath('data.shipping_cents', 0)
            ->assertJsonPath('data.discount_cents', 0)
            ->assertJsonPath('data.code.code', 'FREESHIP')
            ->assertJsonPath('data.total_cents', 8999);
    }

    public function test_codes_that_cannot_be_used_explain_why(): void
    {
        $this->code(['code' => 'BIGORDER', 'min_subtotal_cents' => 15000]);
        $this->code(['code' => 'OFF', 'is_active' => false]);
        $this->code(['code' => 'OLD', 'expires_at' => now()->subDay()]);
        $this->code(['code' => 'GONE', 'max_uses' => 2, 'used_count' => 2]);

        $cases = [
            'NOPE' => "We don't recognise that code.",
            'OFF' => "We don't recognise that code.",
            'OLD' => 'That code has expired.',
            'GONE' => 'That code has been used up.',
            'BIGORDER' => 'That code needs an order of at least $150.00.',
        ];

        foreach ($cases as $code => $message) {
            // The summary still prices the bag, just without the discount.
            $this->postJson('/api/checkout/quote', ['items' => $this->items(), 'code' => $code])
                ->assertOk()
                ->assertJsonPath('data.code', null)
                ->assertJsonPath('data.code_error', $message)
                ->assertJsonPath('data.total_cents', 8999 + 750);

            // Placing the order with it is refused, and no stock is held.
            $this->postJson('/api/checkout', $this->payload($code))
                ->assertUnprocessable()
                ->assertJsonPath('errors.code.0', $message);
        }

        $this->assertSame(3, $this->stockInM());
        $this->assertSame(0, Order::count());
    }

    public function test_the_usage_limit_holds_and_unpaid_orders_give_their_use_back(): void
    {
        $code = $this->code(['code' => 'ONCE', 'max_uses' => 1]);

        $first = $this->place('ONCE');
        $this->postJson('/api/checkout', $this->payload('ONCE'))
            ->assertUnprocessable()
            ->assertJsonPath('errors.code.0', 'That code has been used up.');
        $this->assertSame(2, $this->stockInM()); // the refused order held nothing

        app(Checkout::class)->cancel($first);
        $this->assertSame(0, $code->fresh()->used_count);

        $second = $this->place('ONCE');
        app(Checkout::class)->expire($second);
        $this->assertSame(0, $code->fresh()->used_count);

        // Cancelling twice gives back one use, not two.
        app(Checkout::class)->cancel($second->fresh());
        $this->assertSame(0, $code->fresh()->used_count);
    }

    public function test_a_late_payment_takes_its_use_back(): void
    {
        $code = $this->code(['max_uses' => 5]);
        $order = $this->place('WELCOME10');
        $checkout = app(Checkout::class);

        $checkout->expire($order);
        $this->assertSame(0, $code->fresh()->used_count);

        $checkout->markPaid($order->fresh());
        $this->assertSame('paid', $order->fresh()->status);
        $this->assertSame(1, $code->fresh()->used_count);
    }

    public function test_paying_keeps_the_use(): void
    {
        $code = $this->code();
        $order = $this->place('WELCOME10');

        $this->postJson("/api/orders/{$order->public_token}/test-payment", ['outcome' => 'succeed'])
            ->assertOk()
            ->assertJsonPath('data.discount_cents', 900)
            ->assertJsonPath('data.discount_code', 'WELCOME10');

        $this->assertSame(1, $code->fresh()->used_count);
    }

    public function test_the_admin_order_page_shows_the_discount(): void
    {
        $this->code();
        $this->code(['code' => 'FREESHIP', 'type' => DiscountCode::FREE_SHIPPING, 'value' => 0]);
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->get(route('order.show', $this->place('WELCOME10')))
            ->assertOk()
            ->assertSee('WELCOME10')
            ->assertSee('−$9.00');

        $this->actingAs($admin)->get(route('order.show', $this->place('FREESHIP')))
            ->assertOk()
            ->assertSee('FREESHIP')
            ->assertSee('Free');
    }

    public function test_an_order_without_a_code_is_unchanged(): void
    {
        $this->code();

        $order = $this->place(null);

        $this->assertSame(0, $order->discount_cents);
        $this->assertNull($order->discount_code);
        $this->assertSame(8999 + 750, $order->total_cents);
        $this->assertSame(0, DiscountCode::first()->used_count);
    }

    public function test_stripe_gets_a_one_off_coupon_for_the_discount(): void
    {
        config(['checkout.gateway' => 'stripe', 'services.stripe.secret' => 'sk_test_x']);
        Http::fake([
            'api.stripe.com/v1/coupons' => Http::response(['id' => 'co_test_1']),
            'api.stripe.com/v1/checkout/sessions' => Http::response(['id' => 'cs_test_1', 'url' => 'https://checkout.stripe.test/cs_test_1']),
        ]);
        $this->code();

        $this->postJson('/api/checkout', $this->payload('WELCOME10'))->assertCreated();

        Http::assertSent(function ($request) {
            if ($request->url() !== 'https://api.stripe.com/v1/coupons') {
                return false;
            }
            parse_str($request->body(), $form);

            return (int) $form['amount_off'] === 900 && $form['duration'] === 'once' && $form['currency'] === 'usd';
        });
        Http::assertSent(function ($request) {
            if ($request->url() !== 'https://api.stripe.com/v1/checkout/sessions') {
                return false;
            }
            parse_str($request->body(), $form);

            return ($form['discounts'][0]['coupon'] ?? null) === 'co_test_1';
        });
    }
}
