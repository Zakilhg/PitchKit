{{-- A switch: the name stays "Dark theme" and aria-checked says whether it's on. --}}
<button type="button" class="icon-button theme-toggle" role="switch" aria-checked="false"
        aria-label="Dark theme" title="Toggle dark theme" data-theme-toggle>
    <span class="theme-icon-dark">@include('admin.partials.icon', ['name' => 'moon'])</span>
    <span class="theme-icon-light">@include('admin.partials.icon', ['name' => 'sun'])</span>
</button>
<script>
    (function () {
        var button = document.currentScript.previousElementSibling;
        var root = document.documentElement;
        var sync = function () { button.setAttribute('aria-checked', String(root.dataset.theme === 'dark')); };
        sync();
        button.addEventListener('click', function () {
            var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
            root.dataset.theme = next;
            try { localStorage.setItem('pitchkit.theme', next); } catch (e) {}
            sync();
        });
        // Follow the system setting until a theme has been picked here.
        matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (event) {
            var saved = null;
            try { saved = localStorage.getItem('pitchkit.theme'); } catch (e) {}
            if (!saved) { root.dataset.theme = event.matches ? 'dark' : 'light'; sync(); }
        });
    })();
</script>
