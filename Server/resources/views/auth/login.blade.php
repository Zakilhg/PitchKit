<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex">
    <title>Log in · PitchKit Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700&family=Rubik:wght@500;600;700&display=swap">
    <link rel="stylesheet" href="{{ asset('css/admin.css') }}">
</head>
<body class="auth">
<main class="auth-card">
    <div class="brand brand-dark">
        <span class="brand-mark" aria-hidden="true"></span>
        PitchKit <span class="brand-tag">Admin</span>
    </div>

    <h1>Log in</h1>
    <p class="muted">Manage jerseys, clubs, leagues and brands.</p>

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
            <p><strong>Local demo account</strong></p>
            <dl>
                <dt>Email</dt><dd><code>{{ $demo['email'] }}</code></dd>
                <dt>Password</dt><dd><code>{{ $demo['password'] }}</code></dd>
            </dl>
        </aside>
    @endif
</main>
</body>
</html>
