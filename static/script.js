document.addEventListener('DOMContentLoaded', () => {
    console.log("%c DISTANT STORM SIGNAL ACTIVE", "background: #000; color: #FAF8F0; font-size: 16px; padding: 5px;");
    const elements = {
        trigger: document.getElementById('search-trigger'),
        overlay: document.getElementById('search-overlay'),
        close: document.getElementById('close-search'),
        input: document.getElementById('search-input'),
        results: document.getElementById('search-results')
    };
    let fuse;
    const cleanRoot = window.SITE_ROOT === '.' ? '' : window.SITE_ROOT;
    const indexPath = cleanRoot + '/search_index.json';

    fetch(indexPath.replace('//', '/'))
        .then(res => res.json())
        .then(data => {
            fuse = new Fuse(data, {
                includeScore: true, threshold: 0.3,
                keys: [{ name: 'title', weight: 0.6 }, { name: 'tags', weight: 0.3 }, { name: 'content', weight: 0.1 }]
            });
        });

    elements.trigger.addEventListener('click', (e) => {
        e.preventDefault(); elements.overlay.style.display = 'block'; elements.input.focus(); document.body.style.overflow = 'hidden';
    });
    const closeSearch = () => { elements.overlay.style.display = 'none'; document.body.style.overflow = 'auto'; elements.input.value = ''; elements.results.innerHTML = ''; };
    elements.close.addEventListener('click', closeSearch);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSearch(); });

    elements.input.addEventListener('input', (e) => {
        if (!fuse) return;
        const results = fuse.search(e.target.value);
        elements.results.innerHTML = '';
        if (results.length === 0 && e.target.value.length > 2) { elements.results.innerHTML = '<div style="font-family:var(--font-mono); margin-top:2rem;">NO SIGNAL MATCH.</div>'; return; }
        results.slice(0, 5).forEach(res => {
            const item = res.item;
            const link = cleanRoot + '/' + item.url;
            const div = document.createElement('div');
            div.className = 'result-item';
            div.innerHTML = `<div style="font-family:var(--font-mono); font-size:0.7rem; color:#666; margin-bottom:5px;">FREQ MATCH: ${(1-res.score).toFixed(2)} // ${item.tags.join(', ')}</div><h3><a href="${link.replace('//', '/')}">${item.title}</a></h3>`;
            elements.results.appendChild(div);
        });
    });
});
