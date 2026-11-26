<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class DiscountCode extends Model
{
    public const PERCENT = 'percent';             // value: 1-100

    public const FIXED = 'fixed';                 // value: cents off the items

    public const FREE_SHIPPING = 'free_shipping'; // value unused

    public const TYPES = [self::PERCENT, self::FIXED, self::FREE_SHIPPING];

    protected $fillable = [
        'code',
        'type',
        'value',
        'min_subtotal_cents',
        'max_uses',
        'used_count',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'value' => 'integer',
        'min_subtotal_cents' => 'integer',
        'max_uses' => 'integer',
        'used_count' => 'integer',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(fn (DiscountCode $code) => $code->code = self::normalise($code->code));
    }

    public static function normalise(?string $code): string
    {
        return strtoupper(trim((string) $code));
    }

    public static function findByCode(?string $code): ?self
    {
        $code = self::normalise($code);

        return $code === '' ? null : self::query()->where('code', $code)->first();
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    /** Why this code can't be used on a bag with this subtotal, or null if it can. */
    public function problemWith(int $subtotalCents): ?string
    {
        if (! $this->is_active) {
            return "We don't recognise that code.";
        }
        if ($this->expires_at?->isPast()) {
            return 'That code has expired.';
        }
        if ($this->max_uses !== null && $this->used_count >= $this->max_uses) {
            return 'That code has been used up.';
        }
        if ($subtotalCents < $this->min_subtotal_cents) {
            return 'That code needs an order of at least $'.number_format($this->min_subtotal_cents / 100, 2).'.';
        }

        return null;
    }

    /** Cents off the items. Free shipping is applied to the shipping charge instead. */
    public function discountOn(int $subtotalCents): int
    {
        return match ($this->type) {
            self::PERCENT => (int) round($subtotalCents * min($this->value, 100) / 100),
            self::FIXED => min($this->value, $subtotalCents),
            default => 0,
        };
    }

    /** Where the code stands right now, for the admin list. */
    public function status(): string
    {
        return match (true) {
            ! $this->is_active => 'Off',
            (bool) $this->expires_at?->isPast() => 'Expired',
            $this->max_uses !== null && $this->used_count >= $this->max_uses => 'Used up',
            default => 'Active',
        };
    }

    /** Short description for the admin and the storefront, e.g. "10% off". */
    public function label(): string
    {
        return match ($this->type) {
            self::PERCENT => "{$this->value}% off",
            self::FIXED => '$'.number_format($this->value / 100, 2).' off',
            default => 'Free shipping',
        };
    }

    /**
     * Take one use, if the code is still usable right now. A conditional update,
     * so two customers can't both take the last use. Returns false if it's gone.
     */
    public function claim(): bool
    {
        return self::query()
            ->whereKey($this->id)
            ->where('is_active', true)
            ->where(fn (Builder $q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->where(fn (Builder $q) => $q->whereNull('max_uses')->orWhereColumn('used_count', '<', 'max_uses'))
            ->update(['used_count' => DB::raw('used_count + 1'), 'updated_at' => now()]) === 1;
    }

    /** A late payment honours the code even if it has run out since. */
    public static function reclaim(int $id): void
    {
        self::query()->whereKey($id)->increment('used_count');
    }

    public static function release(int $id): void
    {
        self::query()->whereKey($id)->where('used_count', '>', 0)->decrement('used_count');
    }
}
