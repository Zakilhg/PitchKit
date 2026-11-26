<?php

namespace App\Checkout\Gateways;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use RuntimeException;

/**
 * Stripe Checkout through its REST API (no SDK needed). Turned on by setting
 * STRIPE_SECRET; payment is confirmed by the webhook and, as a fallback, when
 * the customer comes back to the order page.
 */
class StripeGateway implements PaymentGateway
{
    private const API = 'https://api.stripe.com/v1';

    public function name(): string
    {
        return 'stripe';
    }

    public function start(Order $order): string
    {
        $store = config('checkout.storefront_url');
        $order->loadMissing('items');

        $form = [
            'mode' => 'payment',
            'client_reference_id' => $order->public_token,
            'customer_email' => $order->email,
            'success_url' => "{$store}/order/{$order->public_token}",
            'cancel_url' => "{$store}/checkout?cancelled={$order->public_token}",
            // Stripe's minimum; our stock reservation lasts a little longer.
            'expires_at' => now()->addMinutes(30)->timestamp,
            'metadata[order]' => $order->public_token,
        ];

        foreach ($order->items as $i => $item) {
            $form["line_items[$i][quantity]"] = $item->quantity;
            $form["line_items[$i][price_data][currency]"] = $order->currency;
            $form["line_items[$i][price_data][unit_amount]"] = $item->unit_price_cents;
            $form["line_items[$i][price_data][product_data][name]"] = "{$item->name} ({$item->size})";
        }

        if ($order->shipping_cents > 0) {
            $form['shipping_options[0][shipping_rate_data][type]'] = 'fixed_amount';
            $form['shipping_options[0][shipping_rate_data][display_name]'] = 'Standard shipping';
            $form['shipping_options[0][shipping_rate_data][fixed_amount][amount]'] = $order->shipping_cents;
            $form['shipping_options[0][shipping_rate_data][fixed_amount][currency]'] = $order->currency;
        }

        // Stripe totals the line items itself, so the discount goes in as a
        // one-off coupon for exactly the amount this order was given.
        if ($order->discount_cents > 0) {
            $coupon = $this->client()->asForm()->post(self::API.'/coupons', [
                'amount_off' => $order->discount_cents,
                'currency' => $order->currency,
                'duration' => 'once',
                'max_redemptions' => 1,
                'name' => $order->discount_code ?? 'Discount',
            ])->throw()->json();
            $form['discounts[0][coupon]'] = $coupon['id'];
        }

        $session = $this->client()->asForm()->post(self::API.'/checkout/sessions', $form)->throw()->json();

        $order->forceFill(['gateway_ref' => $session['id']])->save();

        return $session['url'] ?? throw new RuntimeException('Stripe did not return a checkout URL.');
    }

    public function isPaid(Order $order): bool
    {
        if (! $order->gateway_ref) {
            return false;
        }

        $session = $this->client()->get(self::API.'/checkout/sessions/'.$order->gateway_ref)->throw()->json();

        return ($session['payment_status'] ?? null) === 'paid';
    }

    private function client()
    {
        return Http::withToken((string) config('services.stripe.secret'))->timeout(15);
    }
}
