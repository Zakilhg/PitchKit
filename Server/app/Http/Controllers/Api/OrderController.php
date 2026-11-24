<?php

namespace App\Http\Controllers\Api;

use App\Checkout\Checkout;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Orders are looked up by their 40-character public token, which only the
 * buyer receives, so guests can follow their order without an account.
 */
class OrderController extends Controller
{
    public function show(Order $order, Checkout $checkout): OrderResource
    {
        // The customer may be back before the provider's webhook: ask directly.
        try {
            $order = $checkout->confirm($order);
        } catch (Throwable) {
            // Provider unreachable; the webhook will still settle it.
        }

        return new OrderResource($order->load('items'));
    }

    public function cancel(Order $order, Checkout $checkout): OrderResource
    {
        return new OrderResource($checkout->cancel($order)->load('items'));
    }

    /** The built-in test gateway's "pay" button. No card details are ever sent. */
    public function testPayment(Request $request, Order $order, Checkout $checkout): OrderResource
    {
        abort_unless($order->gateway === 'test', 404);

        $outcome = $request->validate(['outcome' => ['required', Rule::in(['succeed', 'decline'])]])['outcome'];

        if (! $order->isPending()) {
            throw ValidationException::withMessages(['order' => 'This order can no longer be paid.']);
        }
        if ($outcome === 'decline') {
            throw ValidationException::withMessages(['payment' => 'The test payment was declined. Try again or choose “Pay”.']);
        }

        return new OrderResource($checkout->markPaid($order, 'test_'.$order->public_token)->load('items'));
    }

    /** Signed-in customer's order history. */
    public function mine(Request $request): AnonymousResourceCollection
    {
        return OrderResource::collection(
            $request->user()->orders()->with('items')->whereNot('status', Order::CANCELLED)->paginate(20)
        );
    }
}
