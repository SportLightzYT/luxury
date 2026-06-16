class InfiniteGallery {
    constructor() {
        this.layers = [];
        this.layerEls = [];
        this.layerSpeeds = [0.85, 0.48, 0.28];
        this.setHeights = [];
        this.typoOverlay = document.getElementById('typoOverlay');
        this.heroVisuals = document.getElementById('heroVisuals');
        this.introText = document.querySelectorAll('.typography-top, .typography-bottom');
        this.lenis = null;
    }

    init() {
        this.buildLayers();
        this.positionImages();
        this.layerEls = Array.from(document.querySelectorAll('.gallery-layer'));
        this.initLenis();
        this.bindEvents();
    }

    initLenis() {
        if (typeof Lenis === 'undefined') return;
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2,
            infinite: false,
        });
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        this.lenis.on('scroll', (e) => {
            this.updateLayers(e.scroll);
        });
        if (typeof ScrollTrigger !== 'undefined') {
            this.lenis.on('scroll', ScrollTrigger.update);
        }
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
            const fragment = document.createDocumentFragment();
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
                img.width = 400;
                img.height = 512;
                item.appendChild(label);
                item.appendChild(img);
                fragment.appendChild(item);
            });
            setEl.appendChild(fragment);
        });
    }

    positionImages() {
        const vw = window.innerWidth;
        const isMobile = vw < 760;
        const layers = document.querySelectorAll('.gallery-layer');
        this.setHeights = [];

        const padding = isMobile ? 12 : 32;
        const colGap = isMobile ? 8 : 24;
        const totalUsable = vw - padding * 2 - colGap * 2;
        const colWidth = Math.floor(totalUsable / 3);
        const imgW = Math.min(colWidth - 16, isMobile ? 240 : 360);
        const imgH = Math.round(imgW * 1.28);
        const vertGap = isMobile ? 40 : 80;

        const colCenters = [
            padding + colWidth * 0.5,
            padding + colWidth + colGap + colWidth * 0.5,
            padding + (colWidth + colGap) * 2 + colWidth * 0.5
        ];

        layers.forEach((layer, li) => {
            const setEl = layer.querySelector('.gallery-set:not(.is-clone)');
            const items = setEl.querySelectorAll('.gallery-item');
            const cx = colCenters[li];
            let currentY = 40 + li * Math.round(imgH * 0.4);

            items.forEach((item, idx) => {
                item.style.width = imgW + 'px';
                item.style.height = imgH + 'px';
                let x = Math.round(cx - imgW / 2);
                x = Math.max(padding, Math.min(vw - imgW - padding, x));
                item.style.left = x + 'px';
                item.style.top = currentY + 'px';
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

        document.querySelectorAll('.gallery-item').forEach(el => el.classList.add('in-view'));
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.positionImages();
        });
        document.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const idx = parseInt(item.dataset.projectIndex);
                if (!isNaN(idx)) window.location.href = `detail.html?id=${idx}`;
            }
        });
    }

    updateLayers(scroll) {
        if (!this.layerEls.length) return;
        const s = Math.max(0, scroll);
        this.layerEls.forEach((layer, i) => {
            const speed = this.layerSpeeds[i];
            const sh = this.setHeights[i] || 1000;
            const off = (s * speed) % sh;
            layer.style.transform = `translate3d(0, ${-off}px, 0)`;
        });
        if (this.heroVisuals) {
            this.heroVisuals.style.transform = `translate3d(0, ${-s}px, 0)`;
        }
        if (this.introText.length) {
            const threshold = 600;
            const progress = Math.min(1, s / threshold);
            const opacity = 1 - progress;
            this.introText.forEach(el => {
                el.style.opacity = opacity;
                el.style.transform = `translateY(${-progress * 80}px)`;
                el.style.visibility = opacity <= 0 ? 'hidden' : 'visible';
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const gallery = new InfiniteGallery();
    gallery.init();
});
