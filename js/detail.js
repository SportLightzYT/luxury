// ======================= DETAIL VIEW =======================
class DetailView {
    constructor() {
        this.el = document.querySelector('.detail-view');
        this.imageEl = document.getElementById('dvImage');
        this.titleEl = document.getElementById('dvTitle');
        this.yearEl = document.getElementById('dvYear');
        this.typeEl = document.getElementById('dvType');
        this.clientEl = document.getElementById('dvClient');
        this.descriptionEl = document.getElementById('dvDescription');
        this.tagsEl = document.getElementById('dvTags');
        this.linkEl = document.getElementById('dvLink');
        this.counterEl = document.getElementById('dvCounter');
        this.footerCounterEl = document.getElementById('dvFooterCounter');
        this.captionEl = document.getElementById('dvCaption');
        this.galleryEl = document.getElementById('dvGallery');
        this.closeBtn = document.getElementById('dvClose');
        
        this.initFooterWord();
        this.bindEvents();
        this.bindScrollBounds();
        
        // Setup observer for footer reveal
        const footerObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.footer-reveal').forEach(el => footerObserver.observe(el));
    }
    initFooterWord() {
        const wordEl = document.getElementById('dvFooterWord');
        const text = wordEl.textContent;
        wordEl.innerHTML = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = ch;
            const center = (text.length - 1) / 2;
            const t = (i - center) / center;
            const yOff = 32 * t * t;
            const rot = 7 * t;
            span.style.setProperty('--ax', '0px');
            span.style.setProperty('--ay', yOff.toFixed(1) + 'px');
            span.style.setProperty('--ar', rot.toFixed(1) + 'deg');
            span.style.setProperty('--sd', (0.5 + i * 0.07) + 's');
            wordEl.appendChild(span);
        });
    }
    bindEvents() {
        this.closeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
        window.addEventListener('keydown', e => { if (e.key === 'Escape') window.location.href = 'index.html'; });
    }
    bindScrollBounds() {
        const atTop = () => window.scrollY <= 0;
        const atBottom = () => Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;

        window.addEventListener('wheel', (e) => {
            if ((atTop() && e.deltaY < 0) || (atBottom() && e.deltaY > 0)) {
                e.preventDefault();
            }
        }, { passive: false });

        let touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        window.addEventListener('touchmove', (e) => {
            const touchDelta = touchStartY - e.touches[0].clientY;
            if ((atTop() && touchDelta < 0) || (atBottom() && touchDelta > 0)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    render(idx) {
        if (!projects[idx]) return;
        const p = projects[idx];
        const c = String(idx + 1).padStart(2, '0');
        const t = String(projects.length).padStart(2, '0');
        this.imageEl.src = p.image;
        this.imageEl.alt = p.title;
        this.titleEl.textContent = p.title;
        this.yearEl.textContent = p.year;
        this.typeEl.textContent = p.category;
        this.clientEl.textContent = p.client;
        this.linkEl.href = p.link;
        this.counterEl.textContent = `${c} / ${t}`;
        this.footerCounterEl.textContent = `${c} / ${t}`;
        this.captionEl.textContent = `${p.category} — ${p.year}`;
        
        this.descriptionEl.classList.remove('in-view');
        // Split description into lines and create fade-in spans
        const lines = p.description.split('\n');
        this.descriptionEl.innerHTML = '';
        lines.forEach((line, i) => {
            const span = document.createElement('span');
            span.className = 'desc-line';
            span.textContent = line;
            span.style.transitionDelay = (0.2 + i * 0.1) + 's';
            this.descriptionEl.appendChild(span);
        });

        // Observe description for scroll fade
        setTimeout(() => {
            const descObserver = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting) {
                    entries[0].target.classList.add('in-view');
                    descObserver.disconnect();
                }
            }, { threshold: 0.2 });
            descObserver.observe(this.descriptionEl);
        }, 100);
        
        this.tagsEl.innerHTML = '';
        p.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'dv-tag';
            span.textContent = tag;
            this.tagsEl.appendChild(span);
        });
        
        this.renderGallery(idx);
    }
    renderGallery(projectIdx) {
        // 3 rows of 2 columns = 6 images (taller aspect-ratio)
        let html = '<div class="dv-gallery-head"><span>Additional Frames</span><span>09 Images</span></div>';
        for (let row = 0; row < 3; row++) {
            html += '<div class="dv-gallery-row">';
            for (let col = 0; col < 3; col++) {
                const imgIdx = (row * 3 + col + projectIdx) % galleryExtra.length;
                html += `<figure class="dv-gallery-item"><img src="${galleryExtra[imgIdx]}" alt="Frame" loading="lazy" /></figure>`;
            }
            html += '</div>';
        }
        this.galleryEl.innerHTML = html;
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('in-view'); });
        }, { threshold: 0.1, rootMargin: '40px 0px' });
        this.galleryEl.querySelectorAll('.dv-gallery-head, .dv-gallery-item').forEach((el, i) => {
            el.style.transitionDelay = (i * 0.08) + 's';
            observer.observe(el);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    
    const params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get('id'));
    if (isNaN(id) || id < 0 || id >= projects.length) id = 0;
    
    const detailView = new DetailView();
    detailView.render(id);
});
