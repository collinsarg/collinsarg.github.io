/* script.js */
(() => {
    const root = document.documentElement;
    const btn = document.getElementById('themeToggle');

    // Initialize theme: localStorage > system preference
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
        root.classList.add('dark');
    }
    if (stored === 'light') {
        root.classList.add('light');
    }

    const setIcon = () => {
        if (!btn) return;
        const dark = root.classList.contains('dark');
        btn.textContent = dark ? '☀️' : '🌙';
        btn.setAttribute('aria-pressed', String(dark));
    };
    setIcon();

    if (btn) {
        btn.addEventListener('click', () => {
            const dark = root.classList.toggle('dark');
            if (dark) root.classList.remove('light');
            localStorage.setItem('theme', dark ? 'dark' : 'light');
            setIcon();
        });
    }

    // Project Grid: interactive hover glow follows cursor
    document.querySelectorAll('.card').forEach(card => {
    const set = (e) => {
        const rect = card.getBoundingClientRect();
        const cx = ('clientX' in e && e.clientX) || (e.touches && e.touches[0]?.clientX);
        const cy = ('clientY' in e && e.clientY) || (e.touches && e.touches[0]?.clientY);
        if (cx == null || cy == null) return;
        const x = Math.round(cx - rect.left);
        const y = Math.round(cy - rect.top);
        card.style.setProperty('--mx', x);
        card.style.setProperty('--my', y);
    };

    card.addEventListener('pointermove', set);
    card.addEventListener('mousemove', set);   // Safari fallback
    card.addEventListener('touchmove', set, { passive: true });
    card.addEventListener('pointerenter', set);
    });

    // Simple client-side search + sort on /projects.html
    const grid = document.getElementById('projectGrid');
    const search = document.getElementById('search');
    const sort = document.getElementById('sort');
    if (grid && search && sort) {
        const items = Array.from(grid.children);

        const apply = () => {
            const q = search.value.trim().toLowerCase();
            const order = sort.value;
            const visible = items.filter(card => {
                const t = (card.getAttribute('data-title') || card.querySelector('h3')?.textContent || '').toLowerCase();
                const body = (card.textContent || '').toLowerCase();
                const hay = t + ' ' + body;
                const match = q.split(/\s+/).every(w => hay.includes(w));
                card.style.display = match ? '' : 'none';
                return match;
            });

            visible.sort((a, b) => {
                const at = (a.getAttribute('data-title') || a.querySelector('h3')?.textContent || '').toLowerCase();
                const bt = (b.getAttribute('data-title') || b.querySelector('h3')?.textContent || '').toLowerCase();
                if (order === 'title-desc') return bt.localeCompare(at);
                return at.localeCompare(bt);
            });

            // Re-append in sorted order
            visible.forEach(node => grid.appendChild(node));
        };

        search.addEventListener('input', apply);
        sort.addEventListener('change', apply);
    }
})();