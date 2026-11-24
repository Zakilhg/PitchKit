<?php

namespace App\Checkout\Gateways;

use App\Models\Order;

interface PaymentGateway
{
    /** Short name stored on the order ("test", "stripe"). */
    public function name(): string;

    /** Start payment for a pending order and return the URL to send the customer to. */
    public function start(Order $order): string;

    /** Ask the provider whether this order has been paid (used when the customer returns). */
    public function isPaid(Order $order): bool;
}
