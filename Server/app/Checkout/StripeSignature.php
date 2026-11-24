<?php

namespace App\Checkout;

/**
 * Verifies the Stripe-Signature header on webhooks (HMAC-SHA256 of
 * "timestamp.payload" with the endpoint secret), as Stripe documents.
 */
class StripeSignature
{
    public const TOLERANCE_SECONDS = 300;

    public static function valid(string $payload, ?string $header, string $secret, ?int $now = null): bool
    {
        if (! $header || $secret === '') {
            return false;
        }

        $timestamp = null;
        $signatures = [];
        foreach (explode(',', $header) as $part) {
            [$key, $value] = array_pad(explode('=', trim($part), 2), 2, null);
            if ($key === 't') {
                $timestamp = (int) $value;
            } elseif ($key === 'v1') {
                $signatures[] = $value;
            }
        }

        if (! $timestamp || ! $signatures || abs(($now ?? time()) - $timestamp) > self::TOLERANCE_SECONDS) {
            return false;
        }

        $expected = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);
        foreach ($signatures as $signature) {
            if (hash_equals($expected, (string) $signature)) {
                return true;
            }
        }

        return false;
    }

    /** Builds a valid header (used by the tests). */
    public static function sign(string $payload, string $secret, int $timestamp): string
    {
        return 't='.$timestamp.',v1='.hash_hmac('sha256', $timestamp.'.'.$payload, $secret);
    }
}
