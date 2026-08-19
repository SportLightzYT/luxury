/**
 * creatre(x) — Liquid Inertia & 3D Physics Gallery Engine
 * ------------------------------------------------------------
 * 1) Seamless virtual infinite continuous scroll (Zero freeze, Zero teleportation/warp).
 * 2) Liquid Velocity Skew & Inertia Stretch physics.
 * 3) 3D Interactive Card Tilt & Inner Image Parallax.
 * 4) Kinetic Typography Backdrop Engine.
 * 5) Cinematic Logo & Hero Dissolve on Scroll.
 * 6) Magnetic Luxury Custom Cursor.
 */

(function () {
    'use strict';

    function clamp(val, min, max) {
        return Math.min(Math.max(val, min), max);
    }

    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    class LiquidGallery {
        constructor() {
            this.container = document.querySelector('.gallery-wrapper');
            this.kineticBg = document.querySelector('.kinetic-bg-wrap');
            this.typoOverlay = document.getElementById('typoOverlay') || document.querySelector('.typography-overlay');
            this.typoTop = document.querySelector('.typography-top');
            this.typoBottom = document.querySelector('.typography-bottom');
            this.heroVisuals = document.querySelector('.hero-visuals-container');
            this.scrollIndicator = document.querySelector('.scroll-indicator');
            this.indexPanel = document.querySelector('.index-panel');

            // Virtual Scroll & Physics
            this.targetScroll = 0;
            this.currentScroll = 0;
            this.velocity = 0;
            this.lerpedVelocity = 0;

            // Layout
            this.cardElements = [];
            this.colSpeeds = [0.72, 1.05, 0.58];

            // Mouse & Cursor
            this.mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.cursorPos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
            this.activeHoverItem = null;
            this.hoverOffset = { x: 0, y: 0, targetX: 0, targetY: 0 };

            // Touch
            this.touchStartY = 0;
            this.touchLastY = 0;
            this.isDragging = false;

            this.rafId = null;
            this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.activeLogoVariant = 1;
            this.navLogo = document.querySelector('.nav-logo');
            this.dockingBox = document.getElementById('dockingLogoBox');
            this.spatialCard = document.getElementById('spatialEmblemCard');
            this.watermarkX = document.getElementById('manifestoWatermarkX');
        }

        init() {
            if (typeof projects === 'undefined' || !this.container) return;

            this.initCursor();
            this.initKineticBackdrop();
            this.initLogoSwitcher();
            this.buildColumns();
            this.bindEvents();
            this.startLoop();
        }

        /* ─────────────────────────────────────────
           INTERACTIVE LOGO MODE SWITCHER
        ───────────────────────────────────────── */
        initLogoSwitcher() {
            const dock = document.getElementById('logoModeDock');
            if (!dock) return;

            const modeBadge = document.getElementById('activeModeName');
            const buttons = dock.querySelectorAll('[data-set-variant]');
            const variants = document.querySelectorAll('.hero-logo-variant');

            const modeLabels = {
                '1': '01 Docking',
                '2': '02 Cutout (X)',
                '3': '03 Spatial 3D',
                '4': '04 Manifesto',
                '5': '05 Minimal'
            };

            const setVariant = (variantId) => {
                this.activeLogoVariant = parseInt(variantId, 10) || 1;
                localStorage.setItem('creatrex_logo_variant', String(this.activeLogoVariant));

                if (modeBadge) {
                    modeBadge.textContent = modeLabels[variantId] || `0${variantId}`;
                }

                buttons.forEach(btn => {
                    btn.classList.toggle('is-active', btn.dataset.setVariant === String(variantId));
                });

                variants.forEach(v => {
                    const isActive = v.dataset.variant === String(variantId);
                    v.classList.toggle('is-active', isActive);
                });

                // Reset nav logo visibility for non-docking modes
                if (this.navLogo) {
                    if (this.activeLogoVariant === 1) {
                        const scrollDist = Math.abs(this.currentScroll);
                        const progress = clamp(scrollDist / 140, 0, 1);
                        this.navLogo.style.opacity = String(progress);
                        this.navLogo.style.pointerEvents = progress > 0.4 ? 'auto' : 'none';
                    } else {
                        this.navLogo.style.opacity = '1';
                        this.navLogo.style.pointerEvents = 'auto';
                    }
                }
            };

            buttons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const targetVariant = btn.dataset.setVariant;
                    if (targetVariant) {
                        setVariant(targetVariant);
                    }
                });
            });

            // Load saved variant or default to 1
            const savedVariant = localStorage.getItem('creatrex_logo_variant') || '1';
            setVariant(savedVariant);
        }

        /* ─────────────────────────────────────────
           KINETIC TYPOGRAPHY BACKDROP
        ───────────────────────────────────────── */
        initKineticBackdrop() {
            if (!this.kineticBg) return;

            const texts = [
                'CREATRE(X) STUDIO · PARIS · MARSEILLE · CREATRE(X) STUDIO · PARIS · MARSEILLE ·',
                'SELECTED ARCHIVE 2026 · AI PRODUCTION · LUXURY SYSTEMS · SELECTED ARCHIVE 2026 · AI PRODUCTION · LUXURY SYSTEMS ·',
                'PRINT & FILM · EXPERIMENTAL 3D · CRAFTING CULTURE · PRINT & FILM · EXPERIMENTAL 3D · CRAFTING CULTURE ·'
            ];

            this.kineticBg.innerHTML = '';
            this.kineticRows = [];

            texts.forEach((txt, i) => {
                const row = document.createElement('div');
                row.className = `kinetic-row kinetic-row-${i + 1}`;
                row.innerHTML = `<span>${txt}</span><span>${txt}</span>`;
                this.kineticBg.appendChild(row);
                this.kineticRows.push({ el: row, dir: i % 2 === 0 ? 1 : -1, speed: 0.35 + i * 0.15 });
            });
        }

        /* ─────────────────────────────────────────
           CUSTOM MAGNETIC CURSOR
        ───────────────────────────────────────── */
        initCursor() {
            if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

            this.cursorEl = document.getElementById('luxuryCursor');
            this.cursorDot = document.getElementById('luxuryCursorDot');

            if (!this.cursorEl || !this.cursorDot) return;

            document.addEventListener('mousemove', (e) => {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;

                if (!this.cursorEl.classList.contains('is-active')) {
                    this.cursorEl.classList.add('is-active');
                    this.cursorDot.classList.add('is-active');
                }
            }, { passive: true });

            document.addEventListener('mouseleave', () => {
                if (this.cursorEl) {
                    this.cursorEl.classList.remove('is-active');
                    this.cursorDot.classList.remove('is-active');
                }
            });
        }

        /* ─────────────────────────────────────────
           COLUMN & CARD GENERATION
        ───────────────────────────────────────── */
        buildColumns() {
            this.container.innerHTML = '';
            this.cardElements = [];

            const vw = window.innerWidth;
            const isMobile = vw <= 768;
            const numCols = isMobile ? 2 : 3;
            this.colSpeeds = isMobile ? [0.85, 1.1] : [0.72, 1.05, 0.58];

            const padding = isMobile ? 12 : 36;
            const gap = isMobile ? 12 : 28;
            const totalWidth = vw - padding * 2 - gap * (numCols - 1);
            const colWidth = Math.floor(totalWidth / numCols);
            const cardW = colWidth;
            const cardH = Math.round(cardW * 1.28);
            const vertGap = isMobile ? 32 : 64;

            const totalItems = projects.length;
            const perCol = Math.ceil(totalItems / numCols);
            const repeatCount = isMobile ? 4 : 3;

            for (let c = 0; c < numCols; c++) {
                const layerEl = document.createElement('div');
                layerEl.className = `gallery-layer layer-${c + 1}`;
                this.container.appendChild(layerEl);

                const colProjects = [];
                for (let r = 0; r < repeatCount; r++) {
                    for (let i = 0; i < perCol; i++) {
                        const projIdx = (c * perCol + i) % totalItems;
                        colProjects.push({ ...projects[projIdx], projIdx });
                    }
                }

                const colHeight = colProjects.length * (cardH + vertGap);

                colProjects.forEach((proj, idx) => {
                    const card = document.createElement('div');
                    card.className = 'gallery-item';
                    card.dataset.projectIndex = String(proj.projIdx);
                    card.style.width = `${cardW}px`;
                    card.style.height = `${cardH}px`;

                    const imgWrap = document.createElement('div');
                    imgWrap.className = 'gallery-item__img-wrap';

                    const img = document.createElement('img');
                    img.src = proj.homeImage || proj.image;
                    img.alt = proj.title;
                    img.loading = idx < 6 ? 'eager' : 'lazy';
                    img.decoding = 'async';
                    img.draggable = false;
                    imgWrap.appendChild(img);

                    const label = document.createElement('div');
                    label.className = 'gallery-label';
                    label.innerHTML = `
                        <span class="gallery-label-meta">
                            <span>0${(proj.projIdx + 1)}</span> · <span>${proj.category || 'PROJECT'}</span>
                        </span>
                        <span class="gallery-label-title">${proj.title}</span>
                    `;

                    card.appendChild(imgWrap);
                    card.appendChild(label);
                    layerEl.appendChild(card);

                    this.cardElements.push({
                        el: card,
                        img: img,
                        colIndex: c,
                        index: idx,
                        baseX: padding + c * (colWidth + gap),
                        baseY: idx * (cardH + vertGap),
                        w: cardW,
                        h: cardH,
                        step: cardH + vertGap,
                        colHeight: colHeight,
                        projIdx: proj.projIdx
                    });
                });
            }
        }

        /* ─────────────────────────────────────────
           EVENT LISTENERS
        ───────────────────────────────────────── */
        bindEvents() {
            // Smooth Wheel Input
            window.addEventListener('wheel', (e) => {
                const delta = e.deltaY * 0.95;
                this.targetScroll += delta;
            }, { passive: true });

            // Touch Input (Mobile & Tablets)
            window.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    this.isDragging = true;
                    this.touchStartY = e.touches[0].clientY;
                    this.touchLastY = this.touchStartY;
                }
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (this.isDragging && e.touches.length === 1) {
                    const currentY = e.touches[0].clientY;
                    const deltaY = (this.touchLastY - currentY) * 1.85;
                    this.targetScroll += deltaY;
                    this.touchLastY = currentY;
                }
            }, { passive: true });

            window.addEventListener('touchend', () => {
                this.isDragging = false;
            }, { passive: true });

            // Card Navigation
            this.container.addEventListener('click', (e) => {
                const item = e.target.closest('.gallery-item');
                if (item) {
                    const idx = item.dataset.projectIndex;
                    if (idx !== undefined) {
                        const targetUrl = `detail.html?id=${idx}`;
                        if (typeof window.navigateToPage === 'function') {
                            window.navigateToPage(targetUrl);
                        } else {
                            window.location.href = targetUrl;
                        }
                    }
                }
            });

            // Card Hover Physics & Magnetic Cursor Binding
            this.container.addEventListener('mousemove', (e) => {
                const item = e.target.closest('.gallery-item');
                if (item) {
                    this.activeHoverItem = item;
                    const rect = item.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;
                    this.hoverOffset.targetX = clamp((e.clientX - centerX) / (rect.width / 2), -1, 1);
                    this.hoverOffset.targetY = clamp((e.clientY - centerY) / (rect.height / 2), -1, 1);

                    if (this.cursorEl) {
                        this.cursorEl.classList.add('is-hovering');
                        const textEl = this.cursorEl.querySelector('.luxury-cursor__text');
                        if (textEl) textEl.textContent = 'VIEW ↗';
                    }
                } else {
                    if (this.activeHoverItem) {
                        this.resetCardTransform(this.activeHoverItem);
                    }
                    this.activeHoverItem = null;
                    this.hoverOffset.targetX = 0;
                    this.hoverOffset.targetY = 0;

                    if (this.cursorEl) {
                        this.cursorEl.classList.remove('is-hovering');
                    }
                }
            });

            this.container.addEventListener('mouseleave', () => {
                if (this.activeHoverItem) {
                    this.resetCardTransform(this.activeHoverItem);
                }
                this.activeHoverItem = null;
                if (this.cursorEl) {
                    this.cursorEl.classList.remove('is-hovering');
                }
            });

            // Resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    this.buildColumns();
                }, 180);
            }, { passive: true });
        }

        resetCardTransform(cardEl) {
            if (!cardEl) return;
            const img = cardEl.querySelector('img');
            if (img) img.style.transform = '';
        }

        /* ─────────────────────────────────────────
           ANIMATION LOOP (PHYSICS & RENDERING)
        ───────────────────────────────────────── */
        startLoop() {
            const timeOrigin = performance.now();

            const tick = (time) => {
                const elapsed = time - timeOrigin;

                // Smooth Scroll Physics (Damped Inertia)
                this.currentScroll = lerp(this.currentScroll, this.targetScroll, 0.085);
                this.velocity = this.targetScroll - this.currentScroll;
                this.lerpedVelocity = lerp(this.lerpedVelocity, this.velocity, 0.12);

                // Liquid Skew & Tilt Variables
                const skewY = this.isReducedMotion ? 0 : clamp(this.lerpedVelocity * 0.035, -6.5, 6.5);
                const scaleY = this.isReducedMotion ? 1 : 1 + clamp(Math.abs(this.lerpedVelocity) * 0.0004, 0, 0.05);

                // Kinetic Typography Horizontal Drift & Stretch
                if (this.kineticRows && this.kineticRows.length) {
                    const letterStretch = clamp(-0.02 + Math.abs(this.lerpedVelocity) * 0.0006, -0.02, 0.08);

                    this.kineticRows.forEach(row => {
                        const shift = (this.currentScroll * row.speed * row.dir) % (window.innerWidth * 1.5);
                        row.el.style.transform = `translate3d(${shift}px, 0, 0)`;
                        row.el.style.letterSpacing = `${letterStretch}em`;
                    });
                }

                // Update All Gallery Cards with Seamless Infinite Wrapping
                this.cardElements.forEach(card => {
                    const speed = this.colSpeeds[card.colIndex];
                    const effectiveScroll = this.currentScroll * speed;
                    const h = card.colHeight;

                    // Infinite Modulo Mapping with Safe Off-Screen Buffer
                    let y = ((card.baseY - effectiveScroll) % h + h) % h - card.step;

                    // Ambient Floating Micro-Drift
                    const floatOffset = this.isReducedMotion ? 0 : Math.sin(elapsed * 0.0018 + card.index * 0.6) * 4.5;
                    const finalY = y + floatOffset;

                    // Column Rotational Tilt Physics
                    let tiltZ = 0;
                    if (!this.isReducedMotion) {
                        if (card.colIndex === 0) tiltZ = clamp(-this.lerpedVelocity * 0.012, -2.5, 2.5);
                        else if (card.colIndex === 2) tiltZ = clamp(this.lerpedVelocity * 0.012, -2.5, 2.5);
                    }

                    // Apply Hardware-Accelerated 3D Transform
                    card.el.style.transform = `translate3d(${card.baseX}px, ${finalY}px, 0) skewY(${skewY}deg) rotateZ(${tiltZ}deg) scaleY(${scaleY})`;

                    // 3D Perspective Tilt on Hovered Item
                    if (this.activeHoverItem === card.el) {
                        this.hoverOffset.x = lerp(this.hoverOffset.x, this.hoverOffset.targetX, 0.15);
                        this.hoverOffset.y = lerp(this.hoverOffset.y, this.hoverOffset.targetY, 0.15);

                        const rotX = -this.hoverOffset.y * 8;
                        const rotY = this.hoverOffset.x * 8;

                        card.el.style.transform += ` perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(24px)`;

                        if (card.img) {
                            card.img.style.transform = `translate3d(${-this.hoverOffset.x * 14}px, ${-this.hoverOffset.y * 14}px, 0) scale(1.1)`;
                        }
                    }
                });

                // Magnetic Custom Cursor Lerp
                if (this.cursorEl && this.cursorDot) {
                    this.cursorPos.x = lerp(this.cursorPos.x, this.mouse.x, 0.22);
                    this.cursorPos.y = lerp(this.cursorPos.y, this.mouse.y, 0.22);

                    this.cursorEl.style.transform = `translate3d(${this.cursorPos.x}px, ${this.cursorPos.y}px, 0)`;
                    this.cursorDot.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
                }

                // =========================================================
                // CINEMATIC LOGO & HERO DISSOLVE ON SCROLL
                // =========================================================
                const scrollDist = Math.abs(this.currentScroll);
                const fadeDistance = 180; // Fast & silky smooth fade as soon as user starts scrolling
                const progress = clamp(scrollDist / fadeDistance, 0, 1);
                const heroOpacity = Math.max(0, 1 - progress * 1.35);
                const heroTranslateY = -progress * 60;
                const heroBlur = progress * 8;

                if (this.typoOverlay) {
                    this.typoOverlay.style.opacity = String(heroOpacity);
                    this.typoOverlay.style.transform = `translate3d(0, ${heroTranslateY}px, 0)`;
                    this.typoOverlay.style.pointerEvents = heroOpacity <= 0.05 ? 'none' : 'auto';
                    this.typoOverlay.style.visibility = heroOpacity <= 0.005 ? 'hidden' : 'visible';
                }

                // Mode-specific physics & transitions
                if (this.activeLogoVariant === 1) {
                    // MODE 1: Scroll-to-Dock
                    if (this.navLogo) {
                        const dockProgress = clamp(scrollDist / 140, 0, 1);
                        this.navLogo.style.opacity = String(dockProgress);
                        this.navLogo.style.pointerEvents = dockProgress > 0.4 ? 'auto' : 'none';
                    }
                    if (this.dockingBox) {
                        const dockScale = 1 - progress * 0.35;
                        const dockY = -progress * 24;
                        this.dockingBox.style.transform = `translate3d(0, ${dockY}px, 0) scale(${dockScale})`;
                    }
                } else if (this.activeLogoVariant === 3 && this.spatialCard && !this.isReducedMotion) {
                    // MODE 3: 3D Spatial Mouse Tilt
                    const normX = clamp((this.mouse.x - window.innerWidth / 2) / (window.innerWidth / 2), -1, 1);
                    const normY = clamp((this.mouse.y - window.innerHeight / 2) / (window.innerHeight / 2), -1, 1);
                    const tiltX = -normY * 10;
                    const tiltY = normX * 10;
                    this.spatialCard.style.transform = `rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(8px)`;
                } else if (this.activeLogoVariant === 4 && this.watermarkX) {
                    // MODE 4: Watermark X drift & subtle rotation
                    const xDrift = this.currentScroll * 0.12;
                    const xRot = this.currentScroll * 0.015;
                    this.watermarkX.style.transform = `translate3d(${xDrift.toFixed(1)}px, 0, 0) rotate(${xRot.toFixed(2)}deg)`;
                }

                if (this.scrollIndicator) {
                    const indicatorOpacity = Math.max(0, 1 - scrollDist / 80);
                    this.scrollIndicator.style.opacity = String(indicatorOpacity);
                }

                this.rafId = requestAnimationFrame(tick);
            };

            this.rafId = requestAnimationFrame(tick);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            const gallery = new LiquidGallery();
            gallery.init();
            window.LiquidGalleryInstance = gallery;
        });
    } else {
        const gallery = new LiquidGallery();
        gallery.init();
        window.LiquidGalleryInstance = gallery;
    }
})();
