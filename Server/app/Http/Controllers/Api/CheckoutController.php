<?php

namespace App\Http\Controllers\Api;

use App\Checkout\Checkout;
use App\Checkout\Quote;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Jersey;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CheckoutController extends Controller
{
    /** Price a bag without placing an order (checkout page summary). */
    public function quote(Request $request): JsonResponse
    {
        $quote = Quote::for($this->validateItems($request), $this->validateCode($request));

        return response()->json(['data' => [
            'lines' => $quote->lines,
            'subtotal_cents' => $quote->subtotalCents,
            'shipping_cents' => $quote->shippingCents,
            'discount_cents' => $quote->discountCents,
            'code' => $quote->code ? ['code' => $quote->code->code, 'label' => $quote->code->label()] : null,
            'code_error' => $quote->codeError,
            'total_cents' => $quote->totalCents(),
            'currency' => config('checkout.currency'),
        ]]);
    }

    public function store(Request $request, Checkout $checkout): JsonResponse
    {
        $items = $this->validateItems($request);
        $code = $this->validateCode($request);
        $customer = $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:120'],
            'address.line1' => ['required', 'string', 'max:200'],
            'address.line2' => ['nullable', 'string', 'max:200'],
            'address.city' => ['required', 'string', 'max:100'],
            'address.postal_code' => ['required', 'string', 'max:20'],
            'address.country' => ['required', 'string', 'size:2'],
        ], attributes: [
            'address.line1' => 'address',
            'address.city' => 'city',
            'address.postal_code' => 'postal code',
            'address.country' => 'country',
        ]);

        // Optional login: a token links the order to the account.
        $result = $checkout->place($items, $customer, $request->user('sanctum'), $code);

        return response()->json(['data' => [
            'order' => new OrderResource($result['order']),
            'payment_url' => $result['payment_url'],
        ]], 201);
    }

    private function validateCode(Request $request): ?string
    {
        return $request->validate(['code' => ['nullable', 'string', 'max:32']])['code'] ?? null;
    }

    /** @return array<int, array{jersey_id:int, size:string, quantity:int}> */
    private function validateItems(Request $request): array
    {
        return $request->validate([
            'items' => ['required', 'array', 'min:1', 'max:20'],
            'items.*.jersey_id' => ['required', 'integer'],
            'items.*.size' => ['required', Rule::in(Jersey::SIZES)],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:'.config('checkout.max_quantity_per_line')],
        ])['items'];
    }
}
