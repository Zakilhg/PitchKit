<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JerseySize extends Model
{
    protected $fillable = ['size', 'stock'];

    protected $casts = ['stock' => 'integer'];

    public function jersey(): BelongsTo
    {
        return $this->belongsTo(Jersey::class);
    }
}
