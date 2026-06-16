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
        
        // Setup observer for footer reveal
        const footerObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    footerObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        document.querySelectorAll('.footer-reveal').forEach(el => footerObserver.observe(el));
    }

    initLenis() {
        if (typeof Lenis === 'undefined') return;
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2,
            infinite: false
        });
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }

    initFooterWord() {
        const wordEl = document.getElementById('dvFooterWord');
        if(!wordEl) return;
        const text = wordEl.textContent;
        wordEl.innerHTML = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = ch;
            const center = (text.length - 1) / 2;
            const t = center === 0 ? 0 : (i - center) / center;
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
        if(this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'index.html';
            });
        }
        window.addEventListener('keydown', e => { if (e.key === 'Escape') window.location.href = 'index.html'; });
    }

    render(idx) {
        if (!projects || !projects[idx]) return;
        const p = projects[idx];
        const c = String(idx + 1).padStart(2, '0');
        const t = String(projects.length).padStart(2, '0');
        if(this.imageEl) {
            this.imageEl.src = p.image;
            this.imageEl.alt = p.title;
        }
        if(this.titleEl) this.titleEl.textContent = p.title;
        if(this.yearEl) this.yearEl.textContent = p.year;
        if(this.typeEl) this.typeEl.textContent = p.category;
        if(this.clientEl) this.clientEl.textContent = p.client;
        if(this.linkEl) this.linkEl.href = p.link;
        if(this.counterEl) this.counterEl.textContent = `${c} / ${t}`;
        if(this.footerCounterEl) this.footerCounterEl.textContent = `${c} / ${t}`;
        if(this.captionEl) this.captionEl.textContent = p.title;
        
        if(this.descriptionEl) {
            this.descriptionEl.classList.remove('in-view');
            const lines = p.description.split('\n');
            this.descriptionEl.innerHTML = '';
            lines.forEach((line, i) => {
                const span = document.createElement('span');
                span.className = 'desc-line';
                span.textContent = line;
                span.style.transitionDelay = (0.2 + i * 0.1) + 's';
                this.descriptionEl.appendChild(span);
            });

            setTimeout(() => {
                const descObserver = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting) {
                        entries[0].target.classList.add('in-view');
                        descObserver.disconnect();
                    }
                }, { threshold: 0.2 });
                descObserver.observe(this.descriptionEl);
            }, 100);
        }
        
        if(this.tagsEl) {
            this.tagsEl.innerHTML = '';
            p.tags.forEach(tag => {
                const span = document.createElement('span');
                span.className = 'dv-tag';
                span.textContent = tag;
                this.tagsEl.appendChild(span);
            });
        }
        
        this.renderGallery(idx);
    }

    renderGallery(projectIdx) {
        if(!this.galleryEl || !projects[projectIdx] || !galleryExtra) return;
        const p = projects[projectIdx];
        
        // Remove innerHTML injection and use safe DOM
        this.galleryEl.innerHTML = '';
        
        const headDiv = document.createElement('div');
        headDiv.className = 'dv-gallery-head';
        const span1 = document.createElement('span');
        span1.textContent = 'Additional Frames';
        const span2 = document.createElement('span');
        span2.textContent = '09 Images';
        headDiv.appendChild(span1);
        headDiv.appendChild(span2);
        this.galleryEl.appendChild(headDiv);

        for (let row = 0; row < 3; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'dv-gallery-row';
            for (let col = 0; col < 3; col++) {
                const imgIdx = (row * 3 + col + projectIdx) % galleryExtra.length;
                const frameNum = String(row * 3 + col + 1).padStart(2, '0');
                
                const figure = document.createElement('figure');
                figure.className = 'dv-gallery-item';
                
                const labelSpan = document.createElement('span');
                labelSpan.className = 'dv-gallery-label';
                labelSpan.textContent = `${p.title} — Frame ${frameNum}`;
                
                const img = document.createElement('img');
                img.src = galleryExtra[imgIdx];
                img.alt = 'Frame';
                img.loading = 'lazy';
                // Add safe dimensions to prevent CLS
                img.width = 800;
                img.height = 1000;
                
                figure.appendChild(labelSpan);
                figure.appendChild(img);
                rowDiv.appendChild(figure);
            }
            this.galleryEl.appendChild(rowDiv);
        }

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => { 
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view'); 
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '40px 0px' });
        
        this.galleryEl.querySelectorAll('.dv-gallery-head, .dv-gallery-item').forEach((el, i) => {
            el.style.transitionDelay = (i * 0.08) + 's';
            observer.observe(el);
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const view = new DetailView();
    view.initLenis();
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    view.render(!isNaN(id) ? id : 0);
});
