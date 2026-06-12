// ======================= INFINITE GALLERY =======================
class InfiniteGallery {
    constructor() {
        this.layers = [];
        this.targetScroll = 0;
        this.currentScroll = 0;
        this.ease = 0.075;
        this.layerSpeeds = [1.0, 0.65, 0.35];
        this.setHeights = [];
        this.isPaused = false;
        this.typoOverlay = document.getElementById('typoOverlay');
    }
    init() {
        this.buildLayers();
        this.positionImages();
        this.bindEvents();
        this.setupScrollFade();
        this.animate();
    }
    buildLayers() {
        const sets = [
            { layer: 1, projects: [0,1,2,3,4,5,6,7,8,9] },
            { layer: 2, projects: [10,11,12,13,14,0,1,2,3,4] },
            { layer: 3, projects: [5,6,7,8,9,10,11,12,13,14] }
        ];
        sets.forEach(set => {
            const layerEl = document.querySelector(`.gallery-layer.layer-${set.layer}`);
            const setEl = layerEl.querySelector('.gallery-set');
            set.projects.forEach(projIdx => {
                const p = projects[projIdx];
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.projectIndex = projIdx;
                const label = document.createElement('span');
                label.className = 'gallery-label';
                label.dataset.index = String(projIdx + 1).padStart(2, '0');
                label.textContent = p.title;
                const img = document.createElement('img');
                img.src = p.image;
                img.alt = p.title;
                img.loading = 'eager';
                item.appendChild(label);
                item.appendChild(img);
                setEl.appendChild(item);
            });
        });
    }
    positionImages() {
        const vw = window.innerWidth;
        const isMobile = vw < 760;
        const layers = document.querySelectorAll('.gallery-layer');
        this.setHeights = [];
        layers.forEach((layer, li) => {
            const setEl = layer.querySelector('.gallery-set:not(.is-clone)');
            const items = setEl.querySelectorAll('.gallery-item');
            // Small offset per layer so they don't stack identically
            let currentY = (isMobile ? 40 : 60) + (li * (isMobile ? 30 : 50));
            const padding = isMobile ? 16 : 32;
            items.forEach((item, idx) => {
                let w = isMobile ? 320 : 440;
                let h = isMobile ? 420 : 580;
                if (isMobile) {
                    const scale = Math.min(1, (vw - 32) / w);
                    w = Math.round(w * scale);
                    h = Math.round(h * scale);
                }
                item.style.width = w + 'px';
                item.style.height = h + 'px';
                let x;
                if (isMobile) {
                    x = idx % 2 === 0 ? padding : vw - w - padding;
                } else {
                    const col = idx % 3;
                    if (col === 0) x = padding + (idx * 13) % (vw - w - padding * 2);
                    else if (col === 1) x = (vw - w) / 2 + ((idx % 5) - 2) * 28;
                    else x = vw - w - padding - (idx * 17) % (vw - w - padding * 2);
                }
                const gap = (isMobile ? 80 : 110) + (idx % 3) * (isMobile ? 12 : 28);
                const overlap = (idx % 2 === 0) ? (isMobile ? -12 : -30) : 0;
                item.style.left = Math.max(padding, Math.min(vw - w - padding, x)) + 'px';
                item.style.top = (currentY + overlap) + 'px';
                currentY += h + gap;
            });
            const setHeight = currentY + 180;
            this.setHeights[li] = setHeight;
            const existingClone = layer.querySelector('.gallery-set.is-clone');
            if (existingClone) existingClone.remove();
            const clone = setEl.cloneNode(true);
            clone.classList.add('is-clone');
            clone.style.top = setHeight + 'px';
            layer.appendChild(clone);
        });
    }
    bindEvents() {
        window.addEventListener('wheel', e => { if (this.isPaused) return; e.preventDefault(); this.targetScroll = Math.max(0, this.targetScroll + e.deltaY * 0.8); }, { passive: false });
        let touchStart = 0;
        window.addEventListener('touchstart', e => { if (!this.isPaused) touchStart = e.touches[0].clientY; }, { passive: true });
        window.addEventListener('touchmove', e => { if (this.isPaused) return; e.preventDefault(); const dy = touchStart - e.touches[0].clientY; this.targetScroll = Math.max(0, this.targetScroll + dy * 1.2); touchStart = e.touches[0].clientY; }, { passive: false });
        window.addEventListener('resize', () => this.positionImages());

        document.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const idx = parseInt(item.dataset.projectIndex);
                if (!isNaN(idx)) {
                    window.location.href = `detail.html?id=${idx}`;
                }
            }
        });
    }
    setupScrollFade() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const items = entry.target.parentElement.querySelectorAll('.gallery-item');
                    const idx = Array.from(items).indexOf(entry.target);
                    entry.target.style.transitionDelay = (idx % 6) * 0.07 + 's';
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.style.transitionDelay = '0s';
                    entry.target.classList.remove('in-view');
                }
            });
        }, { threshold: 0.05, rootMargin: '80px 0px' });
        document.querySelectorAll('.gallery-item').forEach(el => observer.observe(el));
    }
    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; }
    animate() {
        if (!this.isPaused) {
            this.currentScroll += (this.targetScroll - this.currentScroll) * this.ease;
            const layers = document.querySelectorAll('.gallery-layer');
            layers.forEach((layer, i) => {
                const speed = this.layerSpeeds[i];
                const off = (this.currentScroll * speed) % (this.setHeights[i] || 10000);
                layer.style.transform = `translate3d(0, ${-off}px, 0)`;
            });
            if (this.typoOverlay) {
                const p = Math.min(1, this.currentScroll / 380);
                const e = p * p;
                this.typoOverlay.style.opacity = 1 - e;
                this.typoOverlay.style.transform = `translateY(${-e * 70}px) scale(${1 - e * 0.04})`;
            }
        }
        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Page load effect
    document.body.classList.add('page-loaded');
    
    const gallery = new InfiniteGallery();
    gallery.init();
});
