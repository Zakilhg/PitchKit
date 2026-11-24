<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Order extends Model
{
    public const PENDING = 'pending';     // stock reserved, waiting for payment

    public const PAID = 'paid';

    public const FULFILLED = 'fulfilled'; // shipped

    public const CANCELLED = 'cancelled'; // customer backed out; stock released

    public const EXPIRED = 'expired';     // never paid in time; stock released

    /** Statuses that count as revenue. */
    public const SOLD = [self::PAID, self::FULFILLED];

    protected $fillable = [
        'user_id',
        'status',
        'email',
        'name',
        'shipping_address',
        'subtotal_cents',
        'shipping_cents',
        'total_cents',
        'currency',
        'gateway',
        'gateway_ref',
        'expires_at',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'subtotal_cents' => 'integer',
        'shipping_cents' => 'integer',
        'total_cents' => 'integer',
        'needs_attention' => 'boolean',
        'expires_at' => 'datetime',
        'paid_at' => 'datetime',
        'fulfilled_at' => 'datetime',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            $order->public_token ??= Str::random(40);
        });
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeSold(Builder $query): Builder
    {
        return $query->whereIn('status', self::SOLD);
    }

    public function isPending(): bool
    {
        return $this->status === self::PENDING;
    }

    /** Short, human-friendly reference shown to customers and in the admin. */
    public function reference(): string
    {
        return 'PK-'.str_pad((string) $this->id, 5, '0', STR_PAD_LEFT);
    }

    public function itemCount(): int
    {
        return (int) $this->items->sum('quantity');
    }
}
