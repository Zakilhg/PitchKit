<?php

namespace App\Support;

class Money
{
    public static function format(int $cents, string $currency = 'usd'): string
    {
        $symbol = ['usd' => '$', 'eur' => '€', 'gbp' => '£'][strtolower($currency)] ?? strtoupper($currency).' ';

        return $symbol.number_format($cents / 100, 2);
    }
}
