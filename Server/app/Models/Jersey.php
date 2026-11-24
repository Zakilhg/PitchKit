<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Jersey extends Model
{
    use HasFactory;

    public const SIZES = ['S', 'M', 'L', 'XL'];

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'image1',
        'image2',
        'brand_id',
        'club_id',
        'league_id',
        'is_active',
    ];

    // A cached total of the per-size stock; setStock() and Inventory keep it current.
    protected $attributes = ['quantity' => 0];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'is_active' => 'boolean',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function club(): BelongsTo
    {
        return $this->belongsTo(Club::class);
    }

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function sizes(): HasMany
    {
        return $this->hasMany(JerseySize::class)
            ->orderByRaw("CASE size WHEN 'S' THEN 1 WHEN 'M' THEN 2 WHEN 'L' THEN 3 WHEN 'XL' THEN 4 ELSE 5 END");
    }

    public function priceCents(): int
    {
        return (int) round(((float) $this->price) * 100);
    }

    /**
     * Set the stock for every size at once (admin form, seeder). `quantity` is
     * the cached total; this and Inventory are the only places that write it.
     *
     * @param  array<string, int>  $stock
     */
    public function setStock(array $stock): void
    {
        foreach (self::SIZES as $size) {
            $this->sizes()->updateOrCreate(['size' => $size], ['stock' => max(0, (int) ($stock[$size] ?? 0))]);
        }
        $this->refreshQuantity();
    }

    public function refreshQuantity(): void
    {
        $this->forceFill(['quantity' => (int) $this->sizes()->sum('stock')])->saveQuietly();
    }

    /** @return array<string, int> */
    public function stockBySize(): array
    {
        $stock = array_fill_keys(self::SIZES, 0);
        foreach ($this->sizes as $row) {
            $stock[$row->size] = (int) $row->stock;
        }

        return $stock;
    }

    /** Spread a total across sizes; M and L get the remainder first since they sell most. */
    public static function splitStock(int $total): array
    {
        $total = max(0, $total);
        $stock = array_fill_keys(self::SIZES, intdiv($total, 4));
        foreach (array_slice(['M', 'L', 'S', 'XL'], 0, $total % 4) as $size) {
            $stock[$size]++;
        }

        return $stock;
    }
}
