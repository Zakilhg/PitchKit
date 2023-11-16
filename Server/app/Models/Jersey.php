<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jersey extends Model
{
    use HasFactory;
    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function club() {
        return $this->belongsTo(Club::class);
    }

    public function league() {
        return $this->belongsTo(League::class);
    }
}
