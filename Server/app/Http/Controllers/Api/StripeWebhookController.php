<?php

namespace App\Http\Controllers\Api;

use App\Checkout\Checkout;
use App\Checkout\StripeSignature;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, Checkout $checkout): JsonResponse
    {
        $payload = $request->getContent();

        if (! StripeSignature::valid(
            $payload,
            $request->header('Stripe-Signature'),
            (string) config('services.stripe.webhook_secret'),
        )) {
            return response()->json(['message' => 'Invalid signature.'], 400);
        }

        $event = json_decode($payload, true);
        $session = $event['data']['object'] ?? [];
        $order = Order::query()
            ->where('public_token', $session['client_reference_id'] ?? '')
            ->first();

        if (! $order) {
            return response()->json(['received' => true]); // not ours; acknowledge so Stripe stops retrying
        }

        match ($event['type'] ?? null) {
            'checkout.session.completed', 'checkout.session.async_payment_succeeded' => ($session['payment_status'] ?? null) === 'paid'
                ? $checkout->markPaid($order, $session['id'] ?? null)
                : null,
            'checkout.session.expired' => $checkout->expire($order),
            default => null,
        };

        return response()->json(['received' => true]);
    }
}
