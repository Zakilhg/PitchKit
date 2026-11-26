<?php

namespace Tests\Feature;

use Tests\TestCase;

/**
 * Hosts like Render end HTTPS at a proxy and forward plain HTTP. Unless that
 * proxy is trusted, Laravel builds http:// links and browsers block them.
 */
class TrustedProxyTest extends TestCase
{
    private function getBehindProxy(string $uri)
    {
        return $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.5'])
            ->withHeaders(['X-Forwarded-Proto' => 'https', 'X-Forwarded-Port' => '443'])
            ->get($uri);
    }

    public function test_links_use_https_when_a_trusted_proxy_says_so(): void
    {
        config(['app.trusted_proxies' => '*']);

        $this->getBehindProxy('http://pitchkit.example/admin/login')
            ->assertOk()
            ->assertSee('href="https://pitchkit.example/css/admin.css"', false)
            ->assertDontSee('http://pitchkit.example/', false);
    }

    public function test_forwarded_headers_are_ignored_when_no_proxy_is_trusted(): void
    {
        config(['app.trusted_proxies' => null]);

        $this->getBehindProxy('http://pitchkit.example/admin/login')
            ->assertOk()
            ->assertSee('href="http://pitchkit.example/css/admin.css"', false);
    }
}
