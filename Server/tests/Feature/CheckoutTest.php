<?php

namespace Tests\Feature;

use App\Checkout\Checkout;
use App\Checkout\StripeSignature;
use App\Models\Brand;
use App\Models\Club;
use App\Models\Jersey;
use App\Models\League;
use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class CheckoutTest extends TestCase
{
    use RefreshDatabase;

    private Jersey $jersey;

    protected function setUp(): void
    {
        parent::setUp();

        $league = League::create(['name' => 'La Liga', 'image' => 'la-liga.png']);
        $brand = Brand::create(['name' => 'Nike', 'image' => 'nike.png']);
        $club = Club::create(['name' => 'FC Barcelona', 'image' => 'barca.png', 'league_id' => $league->id]);

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

    private function payload(array $items, array $overrides = []): array
    {
        return $overrides + [
            'items' => $items,
            'email' => 'fan@example.test',
            'name' => 'Test Fan',
            'address' => [
                'line1' => '1 Test Street',
                'city' => 'Testville',
                'postal_code' => '00000',
                'country' => 'US',
            ],
        ];
    }

    private function line(string $size, int $quantity, array $extra = []): array
    {
        return ['jersey_id' => $this->jersey->id, 'size' => $size, 'quantity' => $quantity] + $extra;
    }

    private function stock(string $size): int
    {
        return $this->jersey->fresh('sizes')->stockBySize()[$size];
    }

    private function place(array $items): Order
    {
        $token = $this->postJson('/api/checkout', $this->payload($items))
            ->assertCreated()
            ->json('data.order.token');

        return Order::where('public_token', $token)->firstOrFail();
    }

    public function test_the_server_prices_the_order_and_ignores_client_prices(): void
    {
        $response = $this->postJson('/api/checkout', $this->payload([
            $this->line('M', 2, ['price' => 0.01, 'unit_price_cents' => 1]),
        ]))->assertCreated();

        // 2 × $89.99 = $179.98, over $100 so shipping is free.
        $response->assertJsonPath('data.order.subtotal_cents', 17998)
            ->assertJsonPath('data.order.shipping_cents', 0)
            ->assertJsonPath('data.order.total_cents', 17998)
            ->assertJsonPath('data.order.status', 'pending')
            ->assertJsonPath('data.order.items.0.name', 'FC Barcelona Home Jersey');

        $this->assertStringContainsString('/checkout/pay/', $response->json('data.payment_url'));
    }

    public function test_shipping_is_charged_under_the_free_threshold(): void
    {
        $this->postJson('/api/checkout/quote', ['items' => [$this->line('M', 1)]])
            ->assertOk()
            ->assertJsonPath('data.subtotal_cents', 8999)
            ->assertJsonPath('data.shipping_cents', 750)
            ->assertJsonPath('data.total_cents', 9749);
    }

    public function test_placing_an_order_reserves_stock(): void
    {
        $this->place([$this->line('M', 2)]);

        $this->assertSame(1, $this->stock('M'));
        $this->assertSame(4, $this->jersey->fresh()->quantity); // 1 + 1 + 0 + 2
    }

    public function test_it_will_not_sell_more_than_is_in_stock(): void
    {
        $this->postJson('/api/checkout', $this->payload([$this->line('M', 4)]))
            ->assertUnprocessable()
            ->assertJsonPath('errors', ['items.0' => ['Only 3 left in size M of FC Barcelona Home Jersey.']]);

        $this->postJson('/api/checkout', $this->payload([$this->line('L', 1)]))
            ->assertUnprocessable();

        // Duplicate lines are added up before the stock check.
        $this->postJson('/api/checkout', $this->payload([$this->line('S', 1), $this->line('S', 1)]))
            ->assertUnprocessable();

        $this->assertSame(0, Order::count());
        $this->assertSame(3, $this->stock('M'));
    }

    public function test_hidden_jerseys_cannot_be_bought(): void
    {
        $this->jersey->update(['is_active' => false]);

        $this->postJson('/api/checkout', $this->payload([$this->line('M', 1)]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items.0');
    }

    public function test_a_test_payment_marks_the_order_paid_once(): void
    {
        $order = $this->place([$this->line('M', 1)]);

        $this->postJson("/api/orders/{$order->public_token}/test-payment", ['outcome' => 'succeed'])
            ->assertOk()
            ->assertJsonPath('data.status', 'paid');

        // A replay is refused and changes nothing.
        $this->postJson("/api/orders/{$order->public_token}/test-payment", ['outcome' => 'succeed'])
            ->assertUnprocessable();
        app(Checkout::class)->markPaid($order);

        $this->assertSame(2, $this->stock('M'));
        $this->assertSame('paid', $order->fresh()->status);
    }

    public function test_a_declined_test_payment_keeps_the_order_open(): void
    {
        $order = $this->place([$this->line('M', 1)]);

        $this->postJson("/api/orders/{$order->public_token}/test-payment", ['outcome' => 'decline'])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('payment');

        $this->assertSame('pending', $order->fresh()->status);
    }

    public function test_cancelling_releases_the_stock_once(): void
    {
        $order = $this->place([$this->line('M', 2)]);

        $this->postJson("/api/orders/{$order->public_token}/cancel")->assertJsonPath('data.status', 'cancelled');
        $this->postJson("/api/orders/{$order->public_token}/cancel")->assertJsonPath('data.status', 'cancelled');

        $this->assertSame(3, $this->stock('M'));
    }

    public function test_unpaid_orders_expire_and_release_their_stock(): void
    {
        $order = $this->place([$this->line('XL', 2)]);
        $this->assertSame(0, $this->stock('XL'));

        $this->travel(36)->minutes();
        $this->artisan('orders:expire')->assertSuccessful();

        $this->assertSame('expired', $order->fresh()->status);
        $this->assertSame(2, $this->stock('XL'));
    }

    public function test_a_new_checkout_tidies_up_expired_orders_without_a_scheduler(): void
    {
        $this->place([$this->line('XL', 2)]);
        $this->travel(36)->minutes();

        // XL is free again by the time the next customer checks out.
        $this->place([$this->line('XL', 2)]);

        $this->assertSame(1, Order::where('status', 'expired')->count());
    }

    public function test_a_late_payment_takes_the_stock_back_or_flags_the_order(): void
    {
        $order = $this->place([$this->line('S', 1)]);
        $checkout = app(Checkout::class);
        $checkout->expire($order);
        $this->assertSame(1, $this->stock('S'));

        // Someone else buys the last S before the late payment arrives.
        $this->place([$this->line('S', 1)]);
        $checkout->markPaid($order->fresh());

        $this->assertSame('paid', $order->fresh()->status);
        $this->assertTrue($order->fresh()->needs_attention);
    }

    public function test_guests_see_their_order_by_token_only(): void
    {
        $order = $this->place([$this->line('M', 1)]);

        $this->getJson("/api/orders/{$order->public_token}")
            ->assertOk()
            ->assertJsonPath('data.reference', $order->reference())
            ->assertJsonMissingPath('data.id')
            ->assertJsonMissingPath('data.user_id');

        $this->getJson('/api/orders/not-a-real-token')->assertNotFound();
    }

    public function test_a_signed_in_checkout_is_linked_to_the_account(): void
    {
        $alex = User::factory()->create(['role' => 'user']);

        $this->withToken($alex->createToken('test')->plainTextToken)
            ->postJson('/api/checkout', $this->payload([$this->line('M', 1)]))
            ->assertCreated();

        $this->assertSame($alex->id, Order::first()->user_id);
    }

    public function test_customers_see_only_their_own_orders(): void
    {
        $alex = User::factory()->create(['role' => 'user']);
        $sam = User::factory()->create(['role' => 'user']);
        $this->place([$this->line('M', 1)])->forceFill(['user_id' => $alex->id])->save();
        $this->place([$this->line('XL', 1)]); // a guest order

        $this->withToken($sam->createToken('test')->plainTextToken)
            ->getJson('/api/me/orders')
            ->assertOk()
            ->assertJsonCount(0, 'data');
    }

    public function test_a_customer_sees_their_order_history(): void
    {
        $alex = User::factory()->create(['role' => 'user']);
        $this->place([$this->line('M', 1)])->forceFill(['user_id' => $alex->id])->save();
        $this->place([$this->line('XL', 1)]);

        $this->withToken($alex->createToken('test')->plainTextToken)
            ->getJson('/api/me/orders')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.items.0.size', 'M');
    }

    public function test_order_history_needs_a_login(): void
    {
        $this->getJson('/api/me/orders')->assertUnauthorized();
    }

    public function test_the_stripe_webhook_rejects_bad_signatures(): void
    {
        config(['services.stripe.webhook_secret' => 'whsec_test']);
        $order = $this->place([$this->line('M', 1)]);
        $payload = json_encode([
            'type' => 'checkout.session.completed',
            'data' => ['object' => [
                'id' => 'cs_test_1',
                'client_reference_id' => $order->public_token,
                'payment_status' => 'paid',
            ]],
        ]);

        $this->call('POST', '/api/stripe/webhook', [], [], [], [
            'HTTP_STRIPE_SIGNATURE' => StripeSignature::sign($payload, 'wrong-secret', time()),
            'CONTENT_TYPE' => 'application/json',
        ], $payload)->assertStatus(400);
        $this->assertSame('pending', $order->fresh()->status);

        $this->call('POST', '/api/stripe/webhook', [], [], [], [
            'HTTP_STRIPE_SIGNATURE' => StripeSignature::sign($payload, 'whsec_test', time()),
            'CONTENT_TYPE' => 'application/json',
        ], $payload)->assertOk();
        $this->assertSame('paid', $order->fresh()->status);
        $this->assertSame('cs_test_1', $order->fresh()->gateway_ref);
    }

    public function test_old_webhook_signatures_are_refused(): void
    {
        $payload = '{"type":"checkout.session.completed"}';
        $header = StripeSignature::sign($payload, 'whsec_test', time() - 600);

        $this->assertFalse(StripeSignature::valid($payload, $header, 'whsec_test'));
        $this->assertTrue(StripeSignature::valid($payload, StripeSignature::sign($payload, 'whsec_test', time()), 'whsec_test'));
    }

    public function test_the_stripe_gateway_creates_a_checkout_session_and_confirms_payment(): void
    {
        config(['checkout.gateway' => 'stripe', 'services.stripe.secret' => 'sk_test_x']);
        Http::fake([
            'api.stripe.com/v1/checkout/sessions' => Http::response(['id' => 'cs_test_9', 'url' => 'https://checkout.stripe.test/cs_test_9']),
            'api.stripe.com/v1/checkout/sessions/cs_test_9' => Http::response(['id' => 'cs_test_9', 'payment_status' => 'paid']),
        ]);

        $response = $this->postJson('/api/checkout', $this->payload([$this->line('M', 1)]))->assertCreated();
        $response->assertJsonPath('data.payment_url', 'https://checkout.stripe.test/cs_test_9');

        Http::assertSent(function ($request) {
            if ($request->url() !== 'https://api.stripe.com/v1/checkout/sessions') {
                return false;
            }
            parse_str($request->body(), $form);

            return (int) $form['line_items'][0]['price_data']['unit_amount'] === 8999
                && (int) $form['shipping_options'][0]['shipping_rate_data']['fixed_amount']['amount'] === 750;
        });

        // The customer is back before the webhook: the order page asks Stripe.
        $token = $response->json('data.order.token');
        $this->getJson("/api/orders/{$token}")->assertJsonPath('data.status', 'paid');
    }

    public function test_a_failed_payment_start_gives_the_stock_back(): void
    {
        config(['checkout.gateway' => 'stripe', 'services.stripe.secret' => 'sk_test_x']);
        Http::fake(['api.stripe.com/*' => Http::response(['error' => ['message' => 'down']], 500)]);

        $this->postJson('/api/checkout', $this->payload([$this->line('M', 1)]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('payment');

        $this->assertSame(3, $this->stock('M'));
        $this->assertSame('cancelled', Order::first()->status);
    }
}
