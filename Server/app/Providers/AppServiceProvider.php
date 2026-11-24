<?php

namespace App\Providers;

use App\Checkout\Gateways\PaymentGateway;
use App\Checkout\Gateways\StripeGateway;
use App\Checkout\Gateways\TestGateway;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // The built-in test gateway unless Stripe keys are configured.
        $this->app->bind(PaymentGateway::class, fn () => config('checkout.gateway') === 'stripe'
            ? new StripeGateway
            : new TestGateway);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Paginator::useBootstrap();
    }
}
