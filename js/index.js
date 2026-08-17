class InfiniteGallery {
    constructor() {
        this.layers = [];
        this.layerEls = [];
        this.layerSpeeds = [0.85, 0.48, 0.28];
        this.setHeights = [];
        this.typoOverlay = document.getElementById('typoOverlay');
        this.heroVisuals = document.getElementById('heroVisuals');
        this.introText = document.querySelectorAll('.typography-top, .typography-bottom');
        this.typoTop = document.querySelector('.typography-top');
        this.typoBottom = document.querySelector('.typography-bottom');
        this.lastLayerTransforms = [];
        this.lastHeroTransform = '';
        this.lastTypographyState = ['', ''];
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.scrollSpacer = document.querySelector('.scroll-spacer');
        this.virtualScroll = 0;
        this.lastScrollY = 0;
        this.isInitialized = false;
        this.render = this.render.bind(this);
        this.onScroll = this.onScroll.bind(this);
    }

    init() {
        this.buildLayers();
        this.positionImages();
        this.layerEls = Array.from(document.querySelectorAll('.gallery-layer'));
        this.initScrollPipeline();
        this.initIntroAnimation();
        this.bindEvents();
    }

    initScrollPipeline() {
        if (typeof ScrollUtils === 'undefined' || !ScrollUtils.isReady) {
            setTimeout(() => this.initScrollPipeline(), 50);
            return;
        }

        this.lastScrollY = (typeof ScrollUtils.scrollY === 'number') ? ScrollUtils.scrollY : (window.scrollY || 0);
        this.isInitialized = true;

        ScrollUtils.addScrollCallback(this.onScroll);
        ScrollUtils.addRenderCallback(this.render);
        ScrollUtils.requestRender();
    }

    initIntroAnimation() {
        if (this.prefersReducedMotion || typeof gsap === 'undefined') return;
        document.body.classList.add('index-gsap-ready');

        gsap.set([this.typoTop, this.typoBottom], { opacity: 0, y: 30 });

        const tl = gsap.timeline({ delay: 0.2 });
        tl.to(this.typoTop, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out"
        })
        .to(this.typoBottom, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out"
        }, "-=0.8");
    }

    buildLayers() {
        if (typeof projects === 'undefined') return;

        const sets = [
            { layer: 1, projects: [0, 3, 6, 9, 12] },
            { layer: 2, projects: [1, 4, 7, 10, 13] },
            { layer: 3, projects: [2, 5, 8, 11, 14] }
        ];
        sets.forEach(set => {
            const layerEl = document.querySelector(`.gallery-layer.layer-${set.layer}`);
            if (!layerEl) return;
            const setEl = layerEl.querySelector('.gallery-set');
            setEl.innerHTML = '';
            const fragment = document.createDocumentFragment();
            set.projects.forEach(projIdx => {
                const p = projects[projIdx];
                if (!p) return;
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.dataset.projectIndex = projIdx;
                const label = document.createElement('span');
                label.className = 'gallery-label';
                label.dataset.index = String(projIdx + 1).padStart(2, '0');
                label.textContent = p.title;
                const img = document.createElement('img');
                img.src = p.homeImage || p.image;
                img.alt = p.title;
                img.loading = 'eager';
                img.decoding = 'async';
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
        const step = imgH + vertGap;

        const colCenters = [
            padding + colWidth * 0.5,
            padding + colWidth + colGap + colWidth * 0.5,
            padding + (colWidth + colGap) * 2 + colWidth * 0.5
        ];

        layers.forEach((layer, li) => {
            const setEl = layer.querySelector('.gallery-set:not(.is-clone)');
            if (!setEl) return;
            const items = setEl.querySelectorAll('.gallery-item');
            const count = items.length;
            const cx = colCenters[li];
            const startY = 40 + li * Math.round(imgH * 0.4);

            items.forEach((item, idx) => {
                item.style.width = imgW + 'px';
                item.style.height = imgH + 'px';
                let x = Math.round(cx - imgW / 2);
                x = Math.max(padding, Math.min(vw - imgW - padding, x));
                const y = startY + idx * step;
                item.style.setProperty('--tx', `${x}px`);
                item.style.setProperty('--ty', `${y}px`);
                item.style.zIndex = idx + 1;
            });

            const setHeight = count * step;
            this.setHeights[li] = setHeight;

            layer.querySelectorAll('.gallery-set.is-clone').forEach(el => el.remove());

            // Clone ahead (4 forward clones to cover any viewport height)
            for (let c = 1; c <= 4; c++) {
                const clone = setEl.cloneNode(true);
                clone.classList.add('is-clone', `is-clone-next-${c}`);
                clone.style.top = (setHeight * c) + 'px';
                layer.appendChild(clone);
            }
        });

        document.querySelectorAll('.gallery-item').forEach(el => el.classList.add('in-view'));
    }

    onScroll(scrollState) {
        const currentScroll = Math.max(0, scrollState.scrollY);
        const delta = currentScroll - this.lastScrollY;
        this.virtualScroll = Math.max(0, this.virtualScroll + delta);
        this.lastScrollY = currentScroll;

        // Momentum-preserving recenter when approaching finite runway boundaries
        const lenis = scrollState.lenis;
        if (!lenis) return;

        const runwayMax = scrollState.maxScroll;
        if (runwayMax <= window.innerHeight * 2) return;

        const buffer = Math.max(window.innerHeight * 1.5, 1200);
        const midPoint = Math.round(runwayMax / 2);

        let needsRecenter = false;

        // Approaching bottom of runway while scrolling down → recenter
        if (currentScroll > runwayMax - buffer) {
            needsRecenter = true;
        }
        // Approaching top of runway while virtualScroll is still large → recenter
        // (If virtualScroll is small, let the user naturally reach scrollY=0)
        else if (currentScroll < buffer && this.virtualScroll > midPoint) {
            needsRecenter = true;
        }

        if (needsRecenter) {
            this.lastScrollY = midPoint;
            const remainingTarget = lenis.targetScroll - currentScroll;
            lenis.scroll = midPoint;
            lenis.animatedScroll = midPoint;
            lenis.targetScroll = midPoint + remainingTarget;
            window.scrollTo(0, midPoint);
            if (typeof lenis.preventNextNativeScrollEvent === 'function') {
                lenis.preventNextNativeScrollEvent();
            }
        }
    }

    bindEvents() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.positionImages();
                if (window.ScrollUtils) {
                    window.ScrollUtils.measure();
                    window.ScrollUtils.requestRender();
                }
            }, 150);
        });

        document.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (item) {
                const idx = parseInt(item.dataset.projectIndex);
                if (!isNaN(idx)) window.location.href = `detail.html?id=${idx}`;
            }
        });
    }

    render(scrollState) {
        if (!this.layerEls.length) return;
        const s = this.virtualScroll;

        // Gallery Parallax with Mathematical Modulo Wrapping
        this.layerEls.forEach((layer, i) => {
            const speed = this.layerSpeeds[i];
            const sh = this.setHeights[i] || 2500;
            const off = ((s * speed) % sh + sh) % sh;
            const transform = `translate3d(0, ${-off}px, 0)`;
            if (transform !== this.lastLayerTransforms[i]) {
                layer.style.transform = transform;
                this.lastLayerTransforms[i] = transform;
            }
        });

        // Hero Parallax
        if (this.heroVisuals) {
            const transform = `translate3d(0, ${-s * 0.6}px, 0)`;
            if (transform !== this.lastHeroTransform) {
                this.heroVisuals.style.transform = transform;
                this.lastHeroTransform = transform;
            }
        }

        // Typography Fade
        if (this.typoTop && this.typoBottom) {
            const fadeThreshold = 500;
            const progress = Math.min(1, Math.max(0, s / fadeThreshold));

            const opacityTop = Math.max(0, 1 - (progress * 1.2));
            const yTop = -progress * 100;

            const subProgress = Math.min(1, Math.max(0, (s - 100) / (fadeThreshold - 100)));
            const opacityBottom = Math.max(0, 1 - (subProgress * 1.1));
            const yBottom = -subProgress * 140;

            const topState = `${opacityTop.toFixed(3)}|${yTop.toFixed(1)}|${opacityTop <= 0}`;
            if (topState !== this.lastTypographyState[0]) {
                this.typoTop.style.opacity = opacityTop;
                this.typoTop.style.transform = `translate3d(0, ${yTop}px, 0)`;
                this.typoTop.style.visibility = opacityTop <= 0 ? 'hidden' : 'visible';
                this.lastTypographyState[0] = topState;
            }

            const bottomState = `${opacityBottom.toFixed(3)}|${yBottom.toFixed(1)}|${opacityBottom <= 0}`;
            if (bottomState !== this.lastTypographyState[1]) {
                this.typoBottom.style.opacity = opacityBottom;
                this.typoBottom.style.transform = `translate3d(0, ${yBottom}px, 0)`;
                this.typoBottom.style.visibility = opacityBottom <= 0 ? 'hidden' : 'visible';
                this.lastTypographyState[1] = bottomState;
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const startGallery = () => {
        const gallery = new InfiniteGallery();
        gallery.init();
        window.InfiniteGalleryInstance = gallery;
    };

    if (typeof projects !== 'undefined') {
        startGallery();
    } else {
        window.addEventListener('load', startGallery);
    }
});
