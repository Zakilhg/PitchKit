<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/** A line on an order. Name, image and price are copied so later edits never rewrite history. */
class OrderItem extends Model
{
    protected $fillable = ['jersey_id', 'name', 'image', 'size', 'unit_price_cents', 'quantity'];

    protected $casts = [
        'unit_price_cents' => 'integer',
        'quantity' => 'integer',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function jersey(): BelongsTo
    {
        return $this->belongsTo(Jersey::class);
    }

    public function lineTotalCents(): int
    {
        return $this->unit_price_cents * $this->quantity;
    }
}
