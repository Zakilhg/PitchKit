<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    @include('admin.partials.theme-head')
    <title>@yield('title') · PitchKit Admin</title>
    <link rel="preload" href="{{ asset('fonts/geist.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body class="admin">
<a class="skip-link" href="#content">Skip to content</a>

@php
    $nav = [
        ['route' => 'welcome', 'match' => 'admin', 'label' => 'Dashboard', 'icon' => 'dashboard'],
        ['route' => 'order.index', 'match' => 'admin/order*', 'label' => 'Orders', 'icon' => 'receipt'],
        ['route' => 'discount-code.index', 'match' => 'admin/discount-code*', 'label' => 'Discount codes', 'icon' => 'percent'],
        ['route' => 'jersey.index', 'match' => 'admin/jersey*', 'label' => 'Jerseys', 'icon' => 'shirt'],
        ['route' => 'club.index', 'match' => 'admin/club*', 'label' => 'Clubs', 'icon' => 'shield'],
        ['route' => 'league.index', 'match' => 'admin/league*', 'label' => 'Leagues', 'icon' => 'trophy'],
        ['route' => 'brand.index', 'match' => 'admin/brand*', 'label' => 'Brands', 'icon' => 'tag'],
    ];
    $user = auth()->user();
@endphp

<div class="shell">
    <aside class="sidebar" id="sidebar">
        <a href="{{ route('welcome') }}" class="brand">
            @include('admin.partials.logo')
            <span class="brand-text">PitchKit <small>Admin</small></span>
        </a>

        <nav aria-label="Admin">
            <p class="nav-heading">Store</p>
            <ul class="nav">
                @foreach ($nav as $item)
                    @php $active = request()->is($item['match']); @endphp
                    <li>
                        <a href="{{ route($item['route']) }}" @class(['nav-link', 'is-active' => $active])
                           @if ($active) aria-current="page" @endif>
                            @include('admin.partials.icon', ['name' => $item['icon']])
                            {{ $item['label'] }}
                        </a>
                    </li>
                @endforeach
            </ul>
        </nav>

        <div class="sidebar-foot">
            <a class="nav-link" href="{{ config('app.storefront_url') }}" target="_blank" rel="noopener">
                @include('admin.partials.icon', ['name' => 'external'])
                View storefront
            </a>
            <div class="user-card">
                <span class="avatar" aria-hidden="true">{{ strtoupper(mb_substr($user->first_name ?: $user->username, 0, 1)) }}</span>
                <span class="user-name">
                    {{ trim($user->first_name.' '.$user->last_name) ?: $user->username }}
                    <small>{{ $user->email }}</small>
                </span>
                <form method="POST" action="{{ route('auth.logout') }}">
                    @csrf
                    <button type="submit" class="icon-button" title="Log out">
                        @include('admin.partials.icon', ['name' => 'logout'])
                        <span class="visually-hidden">Log out</span>
                    </button>
                </form>
            </div>
        </div>
    </aside>
    <div class="scrim" data-menu-close hidden></div>

    <div class="main">
        <header class="topbar">
            <button type="button" class="icon-button menu-toggle" aria-controls="sidebar" aria-expanded="false" data-menu-toggle>
                @include('admin.partials.icon', ['name' => 'menu'])
                <span class="visually-hidden">Menu</span>
            </button>
            <nav class="crumbs" aria-label="Breadcrumb">
                <a href="{{ route('welcome') }}">Admin</a>
                <span aria-hidden="true">/</span>
                <span aria-current="page">@yield('title')</span>
            </nav>

            <div class="topbar-actions">
                @include('admin.partials.theme-toggle')
            </div>
        </header>

        <main id="content" class="content" tabindex="-1">
            @foreach (['success' => 'check', 'error' => 'alert'] as $type => $icon)
                @if (session($type))
                    <div class="flash flash-{{ $type }}" role="{{ $type === 'error' ? 'alert' : 'status' }}">
                        @include('admin.partials.icon', ['name' => $icon])
                        <span>{{ session($type) }}</span>
                    </div>
                @endif
            @endforeach

            @yield('content')
        </main>
    </div>
</div>

<script>
    // Mobile sidebar toggle.
    const toggle = document.querySelector('[data-menu-toggle]');
    const sidebar = document.getElementById('sidebar');
    const scrim = document.querySelector('[data-menu-close]');
    const setMenu = (open) => {
        sidebar.classList.toggle('is-open', open);
        scrim.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
    };
    toggle?.addEventListener('click', () => setMenu(!sidebar.classList.contains('is-open')));
    scrim?.addEventListener('click', () => setMenu(false));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
            setMenu(false);
            toggle.focus();
        }
    });

    // Ask before destructive actions.
    document.querySelectorAll('form[data-confirm]').forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (!window.confirm(form.dataset.confirm)) event.preventDefault();
        });
    });

    // Preview a chosen image before saving.
    document.querySelectorAll('input[type=file][data-preview]').forEach((input) => {
        input.addEventListener('change', () => {
            const target = document.getElementById(input.dataset.preview);
            const file = input.files?.[0];
            if (!target || !file) return;
            target.src = URL.createObjectURL(file);
            target.hidden = false;
            target.closest('.upload')?.classList.add('has-image');
        });
    });
</script>
</body>
</html>
