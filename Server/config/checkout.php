<?php

return [
    // Prices are stored in cents to avoid floating-point rounding.
    'currency' => 'usd',
    'shipping_cents' => 750,
    'free_shipping_from_cents' => 10000,

    // How long stock stays reserved for an unpaid order. Stripe needs at least
    // 30 minutes on a Checkout Session, so the reservation outlives it slightly.
    'reservation_minutes' => 35,
    'max_quantity_per_line' => 10,

    // "test" (built in, default) or "stripe" once STRIPE_SECRET is set.
    'gateway' => env('CHECKOUT_GATEWAY', env('STRIPE_SECRET') ? 'stripe' : 'test'),

    // Where customers land after paying or backing out.
    'storefront_url' => rtrim(env('STOREFRONT_URL', 'http://localhost:5173'), '/'),
];
