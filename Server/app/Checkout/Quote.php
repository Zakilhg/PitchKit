<?php

namespace App\Checkout;

use App\Models\Jersey;
use Illuminate\Validation\ValidationException;

/**
 * Prices a bag from the database. The client only says what and how many;
 * every price, shipping charge and total comes from here.
 */
class Quote
{
    /**
     * @param  array<int, array{jersey_id:int, size:string, quantity:int, name:string, image:?string, unit_price_cents:int}>  $lines
     */
    private function __construct(
        public readonly array $lines,
        public readonly int $subtotalCents,
        public readonly int $shippingCents,
    ) {}

    public function totalCents(): int
    {
        return $this->subtotalCents + $this->shippingCents;
    }

    /**
     * @param  array<int, array{jersey_id:int|string, size:string, quantity:int|string}>  $items
     *
     * @throws ValidationException when a jersey is gone, hidden or short on stock
     */
    public static function for(array $items): self
    {
        // Merge duplicate lines (same jersey and size) so stock is checked once.
        $merged = [];
        foreach ($items as $item) {
            $key = $item['jersey_id'].'|'.$item['size'];
            $merged[$key] = [
                'jersey_id' => (int) $item['jersey_id'],
                'size' => $item['size'],
                'quantity' => ($merged[$key]['quantity'] ?? 0) + (int) $item['quantity'],
            ];
        }

        $jerseys = Jersey::query()
            ->with('sizes')
            ->whereIn('id', array_column($merged, 'jersey_id'))
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        $errors = [];
        $lines = [];
        foreach (array_values($merged) as $i => $item) {
            $jersey = $jerseys->get($item['jersey_id']);
            if (! $jersey) {
                $errors["items.$i"] = 'This jersey is no longer sold.';

                continue;
            }
            $left = $jersey->stockBySize()[$item['size']] ?? 0;
            if ($left < $item['quantity']) {
                $errors["items.$i"] = $left > 0
                    ? "Only {$left} left in size {$item['size']} of {$jersey->name}."
                    : "{$jersey->name} is sold out in size {$item['size']}.";

                continue;
            }
            $lines[] = $item + [
                'name' => $jersey->name,
                'image' => $jersey->image,
                'unit_price_cents' => $jersey->priceCents(),
            ];
        }

        if ($errors) {
            throw ValidationException::withMessages($errors);
        }

        $subtotal = array_sum(array_map(fn ($l) => $l['unit_price_cents'] * $l['quantity'], $lines));
        $freeFrom = (int) config('checkout.free_shipping_from_cents');
        $shipping = $subtotal >= $freeFrom ? 0 : (int) config('checkout.shipping_cents');

        return new self($lines, $subtotal, $shipping);
    }
}
