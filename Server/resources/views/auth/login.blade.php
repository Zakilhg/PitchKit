<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    @include('admin.partials.theme-head')
    <title>Log in · PitchKit Admin</title>
    <link rel="preload" href="{{ asset('fonts/geist.woff2') }}" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body class="auth">
<div class="auth-corner">@include('admin.partials.theme-toggle')</div>
<main class="auth-wrap">
    <div class="auth-brand">
        @include('admin.partials.logo')
        <span class="brand-text">PitchKit <small>Admin</small></span>
    </div>
<div class="auth-card">
    <div class="auth-head">
        <h1>Log in to the admin</h1>
        <p class="muted">Manage jerseys, clubs, leagues and brands.</p>
    </div>

    @foreach (['success' => 'check', 'error' => 'alert'] as $type => $icon)
        @if (session($type))
            <div class="flash flash-{{ $type }}" role="{{ $type === 'error' ? 'alert' : 'status' }}">
                @include('admin.partials.icon', ['name' => $icon])
                <span>{{ session($type) }}</span>
            </div>
        @endif
    @endforeach

    <form method="POST" action="{{ route('auth.signin') }}" novalidate>
        @csrf
        <div class="field">
            <label class="label" for="email">Email</label>
            <input class="input" type="email" id="email" name="email" value="{{ old('email') }}" required
                   autocomplete="username" autofocus
                   @error('email') aria-invalid="true" aria-describedby="email-error" @enderror>
            @error('email')<p class="error" id="email-error">{{ $message }}</p>@enderror
        </div>

        <div class="field">
            <label class="label" for="password">Password</label>
            <input class="input" type="password" id="password" name="password" required autocomplete="current-password"
                   @error('password') aria-invalid="true" aria-describedby="password-error" @enderror>
            @error('password')<p class="error" id="password-error">{{ $message }}</p>@enderror
        </div>

        <label class="checkbox">
            <input type="checkbox" name="remember" value="1" @checked(old('remember'))>
            Keep me logged in
        </label>

        <button type="submit" class="btn btn-primary btn-block">Log in</button>
    </form>

    @if ($demo)
        <aside class="demo" aria-label="Demo account">
            <div class="demo-head">
                <p><strong>Demo account</strong></p>
                <button type="button" class="btn btn-secondary btn-sm" data-fill-demo
                        data-email="{{ $demo['email'] }}" data-password="{{ $demo['password'] }}">Fill in</button>
            </div>
            <dl>
                <dt>Email</dt><dd><code>{{ $demo['email'] }}</code></dd>
                <dt>Password</dt><dd><code>{{ $demo['password'] }}</code></dd>
            </dl>
        </aside>
        <script>
            document.querySelector('[data-fill-demo]').addEventListener('click', function () {
                document.getElementById('email').value = this.dataset.email;
                document.getElementById('password').value = this.dataset.password;
                document.querySelector('.auth-card button[type=submit]').focus();
            });
        </script>
    @endif
</div>
    <p class="auth-foot"><a href="{{ config('app.storefront_url') }}">Back to the storefront</a></p>
</main>
</body>
</html>
