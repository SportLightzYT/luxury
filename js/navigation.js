(function () {
    'use strict';

    /* =========================================================
       1. LUXURY INITIAL BOOT LOADER ("PRELOADER")
       ========================================================= */
    function initBootLoader() {
        // Only run preloader on first entrance or hard refresh (not on internal page transitions)
        let isInternalTransition = false;
        try {
            isInternalTransition = sessionStorage.getItem('pt_active') === '1';
        } catch (e) {}

        if (isInternalTransition) return;

        let loader = document.getElementById('bootLoader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'bootLoader';
            loader.className = 'boot-loader';
            loader.setAttribute('aria-hidden', 'true');
            loader.innerHTML = `
                <div class="bl-top-meta">
                    <span class="bl-location">[ PARIS · MARSEILLE ]</span>
                    <span class="bl-status"><span class="bl-dot"></span> ARCHIVE ONLINE</span>
                </div>
                
                <div class="bl-brand">
                    <div class="bl-logo">creatre(x)</div>
                    <div class="bl-sub">CRAFTING CULTURE FOR LUXURY BRANDS</div>
                </div>

                <div class="bl-bottom">
                    <div class="bl-counter-wrap">
                        <span class="bl-counter" id="blCounter">000</span>
                        <span class="bl-unit">%</span>
                    </div>
                    <div class="bl-progress-bar">
                        <div class="bl-progress-fill" id="blProgressFill"></div>
                    </div>
                    <div class="bl-caption" id="blCaption">PRELOADING ASSETS & VISUAL ARTIFACTS</div>
                </div>
                <div class="bl-sheen"></div>
            `;
            document.body.prepend(loader);
        }

        const counterEl = document.getElementById('blCounter');
        const fillEl = document.getElementById('blProgressFill');
        const captionEl = document.getElementById('blCaption');

        const keyImages = [
            'asset/creatrex logo-01_0.webp',
            'asset/creatrex logo-02_0.webp',
            'asset/pics/home-mockup.webp',
            'asset/pics/home-kozen-3.webp'
        ];

        let loadedCount = 0;
        const total = keyImages.length + 1; // +1 for fonts

        const captions = [
            'INITIALIZING LUXURY SYSTEMS...',
            'LOADING 3D ARCHIVE & TEXTURES...',
            'SYNCHRONIZING VISUAL SHADERS...',
            'CALIBRATING INERTIA PHYSICS...',
            'ARCHIVE READY'
        ];

        let targetPercent = 15;
        let currentPercent = 0;

        function updateStep() {
            loadedCount++;
            targetPercent = Math.min(100, Math.round((loadedCount / total) * 100));
        }

        // Preload fonts
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(updateStep).catch(updateStep);
        } else {
            updateStep();
        }

        // Preload images
        keyImages.forEach(src => {
            const img = new Image();
            img.onload = updateStep;
            img.onerror = updateStep;
            img.src = src;
        });

        // Smooth Counter Animation Loop
        let startTime = performance.now();
        const minDuration = 1200; // Minimum dramatic presentation duration (1.2s)
        let isDone = false;

        function tickLoader(now) {
            const elapsed = now - startTime;
            const timeProgress = Math.min(1, elapsed / minDuration);

            // Calculate current interpolated value
            const timeMappedPercent = Math.round(timeProgress * 100);
            const effectiveTarget = Math.max(timeMappedPercent, targetPercent);
            
            currentPercent += (effectiveTarget - currentPercent) * 0.12;

            if (currentPercent > 99.4 && timeProgress >= 1 && loadedCount >= total - 1) {
                currentPercent = 100;
            }

            const displayVal = Math.floor(currentPercent);
            if (counterEl) counterEl.textContent = String(displayVal).padStart(3, '0');
            if (fillEl) fillEl.style.width = `${displayVal}%`;

            // Dynamic caption steps
            if (captionEl) {
                if (displayVal < 25) captionEl.textContent = captions[0];
                else if (displayVal < 55) captionEl.textContent = captions[1];
                else if (displayVal < 80) captionEl.textContent = captions[2];
                else if (displayVal < 100) captionEl.textContent = captions[3];
                else captionEl.textContent = captions[4];
            }

            if (currentPercent < 100 || !isDone) {
                if (currentPercent >= 100) {
                    isDone = true;
                    setTimeout(() => {
                        loader.classList.add('is-hidden');
                        document.body.classList.add('page-loaded');
                        setTimeout(() => {
                            if (loader.parentNode) loader.remove();
                        }, 750);
                    }, 140);
                } else {
                    requestAnimationFrame(tickLoader);
                }
            }
        }

        requestAnimationFrame(tickLoader);
    }

    /* =========================================================
       2. SILKY SMOOTH LUXURY PAGE TRANSITIONS ("วืบวาบ")
       ========================================================= */
    let isTransitioning = false;

    function ensureCurtain() {
        let curtain = document.getElementById('pageCurtain');
        if (!curtain) {
            curtain = document.createElement('div');
            curtain.id = 'pageCurtain';
            curtain.className = 'page-curtain';
            curtain.setAttribute('aria-hidden', 'true');
            curtain.innerHTML = `
                <div class="curtain-bg"></div>
                <div class="curtain-sheen"></div>
            `;
            document.body.appendChild(curtain);
        }
        return curtain;
    }

    window.navigateToPage = function (targetUrl) {
        if (!targetUrl || isTransitioning) return;
        
        // Don't transition if clicking the exact same current page
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const targetClean = targetUrl.split('#')[0].split('?')[0].split('/').pop() || 'index.html';
        const isExactSame = currentPath === targetClean && targetUrl.indexOf('?') === -1 && window.location.search === '';
        
        if (isExactSame) return;

        isTransitioning = true;
        ensureCurtain();

        document.body.classList.remove('page-transitioning-in', 'page-transition-animate-in');
        document.body.classList.add('page-transitioning-out');

        try {
            sessionStorage.setItem('pt_active', '1');
        } catch (err) {}

        // Silky smooth luxury transition duration (850ms)
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 850);

        // Safety fallback timeout
        setTimeout(() => {
            isTransitioning = false;
            document.body.classList.remove('page-transitioning-out');
        }, 3200);
    };

    function initPageTransitions() {
        ensureCurtain();

        // Check if coming from a transition
        let fromTransition = false;
        try {
            fromTransition = sessionStorage.getItem('pt_active') === '1';
            sessionStorage.removeItem('pt_active');
        } catch (err) {}

        if (fromTransition) {
            document.body.classList.add('page-transitioning-in');
            requestAnimationFrame(() => {
                setTimeout(() => {
                    document.body.classList.add('page-transition-animate-in');
                }, 30);
            });

            setTimeout(() => {
                document.body.classList.remove('page-transitioning-in', 'page-transition-animate-in');
                isTransitioning = false;
            }, 950);
        }

        // Global link interceptor for all internal <a> tags
        document.addEventListener('click', (e) => {
            const anchor = e.target.closest('a');
            if (!anchor) return;

            // Ignore modified clicks (new tab / window)
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;

            // Ignore target="_blank"
            if (anchor.target && anchor.target.toLowerCase() === '_blank') return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            // Ignore anchors, protocols, javascript, mailto, tel
            if (href.startsWith('#') ||
                href.startsWith('mailto:') ||
                href.startsWith('tel:') ||
                href.startsWith('javascript:') ||
                href.startsWith('http://') ||
                href.startsWith('https://')) {
                return;
            }

            // Valid relative page (.html or route)
            e.preventDefault();
            window.navigateToPage(href);
        });

        // Browser Back / Forward bfcache restore
        window.addEventListener('pageshow', (event) => {
            isTransitioning = false;
            document.body.classList.remove('page-transitioning-out', 'page-transitioning-in', 'page-transition-animate-in');
        });
    }

    /* =========================================================
       3. HEADER NAVIGATION & MOBILE DRAWER
       ========================================================= */
    function initNavigation() {
        const nav = document.querySelector('.nav');
        if (!nav) return;

        const toggle = nav.querySelector('.nav-toggle');
        const links = nav.querySelector('.nav-links');
        if (!toggle || !links) return;

        document.documentElement.classList.add('nav-enhanced');

        function setMenu(open) {
            nav.classList.toggle('nav-open', open);
            document.body.classList.toggle('nav-menu-open', open);
            toggle.setAttribute('aria-expanded', String(open));
        }

        toggle.addEventListener('click', function () {
            setMenu(!nav.classList.contains('nav-open'));
        });

        links.addEventListener('click', function (event) {
            if (event.target.closest('a')) setMenu(false);
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') setMenu(false);
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 768) {
                setMenu(false);
            }
        }, { passive: true });
    }

    function initAll() {
        initBootLoader();
        initNavigation();
        initPageTransitions();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
