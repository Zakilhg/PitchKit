<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    @include('admin.partials.theme-head')
    <title>@yield('title') · PitchKit Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Rubik:wght@500;600;700&display=swap">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body class="admin">
<a class="skip-link" href="#content">Skip to content</a>

@php
    $nav = [
        ['route' => 'welcome', 'match' => '/', 'label' => 'Dashboard', 'icon' => 'dashboard'],
        ['route' => 'jersey.index', 'match' => 'jersey*', 'label' => 'Jerseys', 'icon' => 'shirt'],
        ['route' => 'club.index', 'match' => 'club*', 'label' => 'Clubs', 'icon' => 'shield'],
        ['route' => 'league.index', 'match' => 'league*', 'label' => 'Leagues', 'icon' => 'trophy'],
        ['route' => 'brand.index', 'match' => 'brand*', 'label' => 'Brands', 'icon' => 'tag'],
    ];
    $user = auth()->user();
@endphp

<div class="shell">
    <aside class="sidebar" id="sidebar">
        <a href="{{ route('welcome') }}" class="brand">
            <span class="brand-mark" aria-hidden="true"></span>
            PitchKit <span class="brand-tag">Admin</span>
        </a>

        <nav aria-label="Admin">
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
        </div>
    </aside>

    <div class="main">
        <header class="topbar">
            <button type="button" class="icon-button menu-toggle" aria-controls="sidebar" aria-expanded="false" data-menu-toggle>
                @include('admin.partials.icon', ['name' => 'menu'])
                <span class="visually-hidden">Menu</span>
            </button>

            <div class="topbar-user">
                @include('admin.partials.theme-toggle')
                <span class="avatar" aria-hidden="true">{{ strtoupper(mb_substr($user->first_name ?: $user->username, 0, 1)) }}</span>
                <span class="user-name">
                    {{ trim($user->first_name.' '.$user->last_name) ?: $user->username }}
                    <small>{{ $user->email }}</small>
                </span>
                <form method="POST" action="{{ route('auth.logout') }}">
                    @csrf
                    <button type="submit" class="btn btn-ghost">
                        @include('admin.partials.icon', ['name' => 'logout'])
                        Log out
                    </button>
                </form>
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
    toggle?.addEventListener('click', () => {
        const open = sidebar.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && sidebar.classList.contains('is-open')) {
            sidebar.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
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
