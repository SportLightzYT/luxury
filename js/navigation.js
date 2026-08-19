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
                <div class="bl-brand">
                    <div class="bl-logo">creatre(x)</div>
                </div>
            `;
            document.body.prepend(loader);
        }

        const keyImages = [
            'asset/creatrex logo-01_0.webp',
            'asset/creatrex logo-02_0.webp',
            'asset/pics/home-mockup.webp',
            'asset/pics/home-kozen-3.webp'
        ];

        let loadedCount = 0;
        const total = keyImages.length + 1; // +1 for fonts

        function updateStep() {
            loadedCount++;
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

        // Hold loader until assets are ready (minimum 1.2s)
        let startTime = performance.now();
        const minDuration = 1200;

        function tickLoader(now) {
            const elapsed = now - startTime;

            if (elapsed >= minDuration && loadedCount >= total) {
                loader.classList.add('is-hidden');
                document.body.classList.add('page-loaded');
                setTimeout(() => {
                    if (loader.parentNode) loader.remove();
                }, 750);
            } else {
                requestAnimationFrame(tickLoader);
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
                const earlyCurtain = document.getElementById('pageCurtain');
                if (earlyCurtain) earlyCurtain.classList.remove('is-active', 'is-early');
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
