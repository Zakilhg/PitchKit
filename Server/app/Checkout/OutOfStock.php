<?php

namespace App\Checkout;

use RuntimeException;

class OutOfStock extends RuntimeException
{
    public function __construct(public readonly int $jerseyId, public readonly string $size)
    {
        parent::__construct("Not enough stock for jersey {$jerseyId} in size {$size}.");
    }
}
