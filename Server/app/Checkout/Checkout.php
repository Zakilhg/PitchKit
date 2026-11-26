<?php

namespace App\Checkout;

use App\Checkout\Gateways\PaymentGateway;
use App\Models\DiscountCode;
use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

/**
 * Order lifecycle: place (reserve stock, start payment) → paid → fulfilled,
 * or cancelled / expired (stock released). Every transition is a conditional
 * update on the current status, so replays and races apply at most once.
 */
class Checkout
{
    public function __construct(
        private readonly Inventory $inventory,
        private readonly PaymentGateway $gateway,
    ) {}

    /**
     * @param  array<int, array{jersey_id:int, size:string, quantity:int}>  $items
     * @param  array{email:string, name:string, address:array}  $customer
     * @return array{order: Order, payment_url: string}
     */
    public function place(array $items, array $customer, ?User $user, ?string $code = null): array
    {
        // No scheduler runs on the free hosting tier, so tidy up lazily here.
        $this->expireStale();

        $quote = Quote::for($items, $code);
        if ($quote->codeError) {
            throw ValidationException::withMessages(['code' => $quote->codeError]);
        }

        $order = DB::transaction(function () use ($quote, $customer, $user) {
            // Take a use of the code first; a failure rolls everything back.
            if ($quote->code && ! $quote->code->claim()) {
                throw ValidationException::withMessages([
                    'code' => $quote->code->fresh()?->problemWith($quote->subtotalCents) ?? 'That code has been used up.',
                ]);
            }

            try {
                $this->inventory->reserve($quote->lines);
            } catch (OutOfStock) {
                // Someone else got there between the quote and the reservation.
                throw ValidationException::withMessages([
                    'items' => 'Some items just sold out. Review your bag and try again.',
                ]);
            }

            $order = Order::create([
                'user_id' => $user?->id,
                'status' => Order::PENDING,
                'email' => $customer['email'],
                'name' => $customer['name'],
                'shipping_address' => $customer['address'],
                'subtotal_cents' => $quote->subtotalCents,
                'shipping_cents' => $quote->shippingCents,
                'discount_code_id' => $quote->code?->id,
                'discount_code' => $quote->code?->code,
                'discount_cents' => $quote->discountCents,
                'total_cents' => $quote->totalCents(),
                'currency' => config('checkout.currency'),
                'gateway' => $this->gateway->name(),
                'expires_at' => now()->addMinutes((int) config('checkout.reservation_minutes')),
            ]);

            $order->items()->createMany(array_map(fn ($line) => [
                'jersey_id' => $line['jersey_id'],
                'name' => $line['name'],
                'image' => $line['image'],
                'size' => $line['size'],
                'unit_price_cents' => $line['unit_price_cents'],
                'quantity' => $line['quantity'],
            ], $quote->lines));

            return $order;
        });

        try {
            $url = $this->gateway->start($order);
        } catch (Throwable $e) {
            // Payment could not start: give the stock back straight away.
            $this->cancel($order);
            Log::error('Payment could not start', ['order' => $order->id, 'error' => $e->getMessage()]);
            throw ValidationException::withMessages(['payment' => 'Payment is unavailable right now. Please try again.']);
        }

        return ['order' => $order->fresh('items'), 'payment_url' => $url];
    }

    /** Idempotent: safe to call from the webhook, the return page and retries. */
    public function markPaid(Order $order, ?string $gatewayRef = null): Order
    {
        DB::transaction(function () use ($order, $gatewayRef) {
            // Read the status from the database: the caller's copy may be stale.
            $before = Order::query()->whereKey($order->id)->value('status');
            if (! in_array($before, [Order::PENDING, Order::EXPIRED, Order::CANCELLED], true)) {
                return; // already paid or fulfilled
            }

            $changed = Order::query()
                ->whereKey($order->id)
                ->where('status', $before)
                ->update([
                    'status' => Order::PAID,
                    'paid_at' => now(),
                    'gateway_ref' => $gatewayRef ?? $order->gateway_ref,
                    'updated_at' => now(),
                ]);

            // Paid after its reservation was released: try to take the stock again,
            // and flag the order for a human if it has sold out meanwhile.
            if ($changed && $before !== Order::PENDING) {
                if ($order->discount_code_id) {
                    DiscountCode::reclaim($order->discount_code_id);
                }
                $lines = $order->loadMissing('items')->items
                    ->filter(fn ($item) => $item->jersey_id)
                    ->map->only(['jersey_id', 'size', 'quantity'])
                    ->values()
                    ->all();
                try {
                    $this->inventory->reserve($lines);
                } catch (OutOfStock) {
                    Order::query()->whereKey($order->id)->update(['needs_attention' => true]);
                }
            }
        });

        return $order->refresh();
    }

    public function cancel(Order $order): Order
    {
        return $this->release($order, Order::CANCELLED);
    }

    public function expire(Order $order): Order
    {
        return $this->release($order, Order::EXPIRED);
    }

    public function fulfil(Order $order): Order
    {
        Order::query()->whereKey($order->id)->where('status', Order::PAID)
            ->update(['status' => Order::FULFILLED, 'fulfilled_at' => now(), 'updated_at' => now()]);

        return $order->refresh();
    }

    /** Release every unpaid order whose reservation has run out. Returns how many. */
    public function expireStale(): int
    {
        $count = 0;
        Order::query()
            ->where('status', Order::PENDING)
            ->where('expires_at', '<', now())
            ->with('items')
            ->each(function (Order $order) use (&$count) {
                if ($this->release($order, Order::EXPIRED)->status === Order::EXPIRED) {
                    $count++;
                }
            });

        return $count;
    }

    /** Ask the gateway whether a pending order got paid (customer returned before the webhook). */
    public function confirm(Order $order): Order
    {
        if ($order->isPending() && $this->gateway->name() === $order->gateway && $this->gateway->isPaid($order)) {
            return $this->markPaid($order);
        }

        return $order;
    }

    private function release(Order $order, string $status): Order
    {
        DB::transaction(function () use ($order, $status) {
            $changed = Order::query()->whereKey($order->id)->where('status', Order::PENDING)
                ->update(['status' => $status, 'updated_at' => now()]);

            if ($changed) {
                $this->inventory->release($order->loadMissing('items'));
                if ($order->discount_code_id) {
                    DiscountCode::release($order->discount_code_id);
                }
            }
        });

        return $order->refresh();
    }
}
