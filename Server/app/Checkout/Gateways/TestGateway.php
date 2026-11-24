<?php

namespace App\Checkout\Gateways;

use App\Models\Order;

/**
 * Built-in gateway so the whole flow works with no payment account. It sends
 * the customer to the storefront's test payment page, which never asks for
 * card details; the outcome is posted back to /api/orders/{token}/test-payment.
 */
class TestGateway implements PaymentGateway
{
    public function name(): string
    {
        return 'test';
    }

    public function start(Order $order): string
    {
        return config('checkout.storefront_url').'/checkout/pay/'.$order->public_token;
    }

    public function isPaid(Order $order): bool
    {
        return false; // only the test-payment endpoint marks these orders paid
    }
}
