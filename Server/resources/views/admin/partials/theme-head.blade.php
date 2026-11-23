{{-- Pick the theme before first paint: a saved choice, else the system setting. --}}
<meta name="color-scheme" content="light dark">
<script>
    (function () {
        var theme;
        try { theme = localStorage.getItem('pitchkit.theme'); } catch (e) {}
        if (theme !== 'light' && theme !== 'dark') {
            theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.dataset.theme = theme;
    })();
</script>
