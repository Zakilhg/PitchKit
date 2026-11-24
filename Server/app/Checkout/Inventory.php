<?php

namespace App\Checkout;

use App\Models\Jersey;
use App\Models\JerseySize;
use App\Models\Order;
use Illuminate\Support\Facades\DB;

/**
 * The only code that moves stock. Reservations are a single conditional UPDATE
 * ("take N if at least N are left") so two shoppers can never buy the last
 * shirt twice, even on SQLite where row locks don't exist.
 */
class Inventory
{
    /**
     * Take stock for every line, or nothing at all.
     *
     * @param  array<int, array{jersey_id:int, size:string, quantity:int}>  $lines
     *
     * @throws OutOfStock
     */
    public function reserve(array $lines): void
    {
        DB::transaction(function () use ($lines) {
            foreach ($lines as $line) {
                $taken = JerseySize::query()
                    ->where('jersey_id', $line['jersey_id'])
                    ->where('size', $line['size'])
                    ->where('stock', '>=', $line['quantity'])
                    ->decrement('stock', $line['quantity']);

                if ($taken === 0) {
                    throw new OutOfStock($line['jersey_id'], $line['size']);
                }
            }
            $this->refreshTotals(array_column($lines, 'jersey_id'));
        });
    }

    /** Put an order's items back on the shelf. */
    public function release(Order $order): void
    {
        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                if (! $item->jersey_id) {
                    continue; // jersey was deleted since; nothing to return it to
                }
                JerseySize::query()
                    ->where('jersey_id', $item->jersey_id)
                    ->where('size', $item->size)
                    ->increment('stock', $item->quantity);
            }
            $this->refreshTotals($order->items->pluck('jersey_id')->filter()->all());
        });
    }

    /** @param  array<int, int>  $jerseyIds */
    private function refreshTotals(array $jerseyIds): void
    {
        Jersey::query()->whereIn('id', array_unique($jerseyIds))->get()->each->refreshQuantity();
    }
}
