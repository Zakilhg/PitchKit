<?php

namespace App\Console\Commands;

use App\Checkout\Checkout;
use Illuminate\Console\Command;

class ExpireOrders extends Command
{
    protected $signature = 'orders:expire';

    protected $description = 'Release stock held by unpaid orders whose reservation has run out';

    public function handle(Checkout $checkout): int
    {
        $count = $checkout->expireStale();
        $this->info("Expired {$count} unpaid ".str('order')->plural($count).'.');

        return self::SUCCESS;
    }
}
