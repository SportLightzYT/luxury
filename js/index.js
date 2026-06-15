// ======================= INFINITE GALLERY =======================
class InfiniteGallery {
    constructor() {
        this.layers = [];
        this.targetScroll = 0;
        this.currentScroll = 0;
        this.lastScroll = -1;
        this.ease = 0.055;            // silkier — lower = smoother deceleration
        this.layerSpeeds = [1.0, 0.65, 0.35];
        this.setHeights = [];
        this.isPaused = false;
        this.rafId = null;
        this.typoOverlay = document.getElementById('typoOverlay');
        // physics-based momentum
        this.velocity = 0;
        this.friction = 0.90;
    }
    init() {
        this.buildLayers();
        this.positionImages();
        this.bindEvents();
        this.animate();
    }
    buildLayers() {
        const sets = [
            { layer: 1, projects: [0, 3, 6, 9, 12] },
            { layer: 2, projects: [1, 4, 7, 10, 13] },
            { layer: 3, projects: [2, 5, 8, 11, 14] }
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

        const padding = isMobile ? 12 : 32;
        const colGap = isMobile ? 8 : 24;

        // Divide viewport into 3 distinct columns — one per layer
        const totalUsable = vw - padding * 2 - colGap * 2;
        const colWidth = Math.floor(totalUsable / 3);
        const imgW = Math.min(colWidth - 16, isMobile ? 240 : 360);
        const imgH = Math.round(imgW * 1.28);
        // Use positive gap to avoid ugly physical overlaps, rely on column staggering instead
        const vertGap = isMobile ? 40 : 80;

        // X center of each column
        const colCenters = [
            padding + colWidth * 0.5,
            padding + colWidth + colGap + colWidth * 0.5,
            padding + (colWidth + colGap) * 2 + colWidth * 0.5
        ];

        layers.forEach((layer, li) => {
            const setEl = layer.querySelector('.gallery-set:not(.is-clone)');
            const items = setEl.querySelectorAll('.gallery-item');

            const cx = colCenters[li];
            // Stagger start Y per layer so they don't line up exactly
            let currentY = 40 + li * Math.round(imgH * 0.4);

            items.forEach((item, idx) => {
                item.style.width = imgW + 'px';
                item.style.height = imgH + 'px';

                // Remove horizontal jitter to prevent columns from bleeding into each other
                let x = Math.round(cx - imgW / 2);
                x = Math.max(padding, Math.min(vw - imgW - padding, x));

                item.style.left = x + 'px';
                item.style.top = currentY + 'px';
                // Raise z-index per item so later items layer on top naturally
                item.style.zIndex = idx + 1;
                currentY += imgH + vertGap;
            });

            const setHeight = currentY + 80;
            this.setHeights[li] = setHeight;
            const existingClone = layer.querySelector('.gallery-set.is-clone');
            if (existingClone) existingClone.remove();
            const clone = setEl.cloneNode(true);
            clone.classList.add('is-clone');
            clone.style.top = setHeight + 'px';
            layer.appendChild(clone);
        });

        // Make all items visible immediately — the gallery is always in motion
        document.querySelectorAll('.gallery-item').forEach(el => el.classList.add('in-view'));
    }
    bindEvents() {
        // Normalise deltaY across pixel / line / page deltaMode AND trackpad vs mouse
        const normaliseDelta = (e) => {
            let delta = e.deltaY;
            if (e.deltaMode === 1) delta *= 28;                      // line mode (Firefox mouse)
            if (e.deltaMode === 2) delta *= window.innerHeight * 0.8; // page mode
            return delta;
        };

        window.addEventListener('wheel', e => {
            if (this.isPaused) return;
            e.preventDefault();
            const delta = normaliseDelta(e);
            // Feed into velocity rather than directly into targetScroll
            this.velocity += delta * 0.5;
        }, { passive: false });

        let lastTouchY = 0;
        let lastTouchTime = 0;

        window.addEventListener('touchstart', e => {
            if (this.isPaused) return;
            lastTouchY = e.touches[0].clientY;
            lastTouchTime = Date.now();
            this.velocity = 0; // reset on new touch
        }, { passive: true });

        window.addEventListener('touchmove', e => {
            if (this.isPaused) return;
            e.preventDefault();
            const now = Date.now();
            const dy = lastTouchY - e.touches[0].clientY;
            const dt = Math.max(1, now - lastTouchTime);
            this.velocity = (dy / dt) * 18; // px/frame approximation
            this.targetScroll = Math.max(0, this.targetScroll + dy * 0.9);
            lastTouchY = e.touches[0].clientY;
            lastTouchTime = now;
        }, { passive: false });

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
    animate() {
        if (!this.isPaused) {
            // Apply friction to velocity each frame
            this.velocity *= this.friction;
            // Hard clamp to prevent huge jumps on fast trackpad flicks
            this.velocity = Math.max(-100, Math.min(100, this.velocity));

            // Accumulate velocity into target
            this.targetScroll = Math.max(0, this.targetScroll + this.velocity);

            // Lerp currentScroll toward targetScroll (smooth deceleration)
            const diff = this.targetScroll - this.currentScroll;
            this.currentScroll += diff * this.ease;

            // Stop micro-jitter when motion is negligible
            if (Math.abs(diff) < 0.05 && Math.abs(this.velocity) < 0.05) {
                this.currentScroll = this.targetScroll;
                this.velocity = 0;
            }

            // ONLY update DOM if scroll position actually changed
            if (Math.abs(this.lastScroll - this.currentScroll) > 0.01) {
                const layers = document.querySelectorAll('.gallery-layer');
                layers.forEach((layer, i) => {
                    const speed = this.layerSpeeds[i];
                    const sh = this.setHeights[i] || 10000;
                    const off = (this.currentScroll * speed) % sh;
                    layer.style.transform = `translate3d(0, ${-off}px, 0)`;
                });

                // Typography overlay fade-out
                if (this.typoOverlay) {
                    const progress = Math.min(1, this.currentScroll / 300);
                    const eased = progress * progress;
                    const opacity = 1 - eased;
                    this.typoOverlay.style.opacity = opacity;
                    this.typoOverlay.style.transform = `translateY(${-eased * 55}px) scale(${1 - eased * 0.03})`;
                    this.typoOverlay.style.visibility = opacity <= 0.04 ? 'hidden' : 'visible';
                }
                this.lastScroll = this.currentScroll;
            }
        }
        this.rafId = requestAnimationFrame(() => this.animate());
    }
    pause() { this.isPaused = true; }
    resume() { this.isPaused = false; }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const gallery = new InfiniteGallery();
    gallery.init();
});
