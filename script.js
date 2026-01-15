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

    // ===== Footer reveal behavior =====
    const footer = document.querySelector('footer');
    const THRESHOLD = 4; // px from the very bottom to trigger reveal

    const evaluateFooterMode = () => {
        if (!footer) return;
        const doc = document.documentElement;
        const longPage = doc.scrollHeight - window.innerHeight > 8;
        if (longPage) {
            footer.classList.add('footer-reveal');
            toggleFooter(); // set initial state based on current scroll
        } else {
            footer.classList.remove('footer-reveal', 'show');
        }
    };

    const toggleFooter = () => {
        if (!footer || !footer.classList.contains('footer-reveal')) return;
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - THRESHOLD;
        footer.classList.toggle('show', atBottom);
    };

    window.addEventListener('scroll', toggleFooter, { passive: true });
    window.addEventListener('resize', evaluateFooterMode);
    evaluateFooterMode();

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
/* ===== Portfolio Add‑ons ===== */

// Navigate from project cards to detail page
(() => {
  const grid = document.getElementById('projectGrid');
  if (!grid) return;
  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.card');
    if (!card) return;
    const slug = card.getAttribute('data-slug');
    if (!slug) return;
    // Avoid following clicks on links/buttons inside card if any later
    if (e.target.tagName === 'A' || e.target.closest('a')) return;
    window.location.href = `project.html?slug=${encodeURIComponent(slug)}`;
  });
})();

// Utility: get URL query param
function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

// Render a detail page from window.PROJECTS
function renderProjectPage() {
  const container = document.getElementById('projectSection');
  if (!container || !window.PROJECTS) return;
  const slug = getParam('slug') || 'dsp';
  const proj = window.PROJECTS[slug];
  if (!proj) {
    container.innerHTML = `<p class="muted">Project not found.</p>`;
    return;
  }
  const tagChips = (proj.tags || []).map(t => `<li>${t}</li>`).join('');
  const details = (proj.details || []).map(d => `<li>${d}</li>`).join('');
  const images = (proj.images || []).map(src => `<img src="${src}" alt="${proj.title} snapshot" loading="lazy" />`).join('');

  container.innerHTML = `
    <div class="project-hero">
      <div class="card">
        <h2>${proj.title}</h2>
        <p style="color:var(--muted)">${proj.summary}</p>
        <ul class="taglist">${tagChips}</ul>
        <div class="actions">
          <a class="btn" href="contact-project.html?slug=${encodeURIComponent(proj.slug)}">Contact about this project</a>
          <a class="btn" href="projects.html">Back to Projects</a>
        </div>
      </div>
      <div class="card">
        <h3>Screenshots</h3>
        <div class="gallery" style="margin-top:.5rem">${images || '<p class="muted">Images Comming Soon</p>'}</div>
      </div>
    </div>

    <div class="card" style="margin-top:1rem">
      <h3>Highlights</h3>
      <ul style="margin-left:1.2rem; margin-top:.5rem;">${details}</ul>
    </div>
  `;
}

// Contact form for a specific project
function setupContactProject() {
  const slug = getParam('slug') || 'dsp';
  const proj = (window.PROJECTS && window.PROJECTS[slug]) || { title: 'this project', slug };
  const form = document.getElementById('contactProjectForm');
  const label = document.getElementById('projName');
  const hidden = document.getElementById('projectSlug');
  if (label) label.textContent = proj.title;
  if (hidden) hidden.value = slug;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg = document.getElementById('message').value.trim();
    // TODO: Replace with your email
    const to = 'you@example.com';
    const subject = encodeURIComponent(`Inquiry about ${proj.title}`);
    const body = encodeURIComponent(
`Project: ${proj.title} (${proj.slug})
From: ${name} <${email}>

${msg}`);
    // Mailto fallback (works on GitHub Pages without a backend)
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  });
}

/* === Notes for a serverless direct submit ===
  If you prefer a submission that doesn't open the user's email client,
  you can replace the mailto logic above with Formspree or EmailJS.

  Example (Formspree):
    1) Create a form endpoint at https://formspree.io/f/XXXXYYYY
    2) In contact-project.html: <form action="https://formspree.io/f/XXXXYYYY" method="POST">
    3) Add fields: <input name="project" value="..."> etc.
    4) On success, show a thank-you message.

  This note is purely instructional and has no effect at runtime.
*/