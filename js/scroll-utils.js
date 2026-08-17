/**
 * scroll-utils.js
 * Smooth scroll initialization (Lenis) + shared scroll state & utilities
 * -----------------------------------------------------------------------
 * Exposes a global `ScrollUtils` object that index.js (and other page
 * scripts) can read from.
 */

(function () {
    'use strict';

    /* ─────────────────────────────────────────
       UTILITY FUNCTIONS
    ───────────────────────────────────────── */

    /** Linear interpolation */
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /** Clamp a value between min and max */
    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    /**
     * Map a value from one range to another
     * e.g. mapRange(0.5, 0, 1, 100, 200) → 150
     */
    function mapRange(value, inMin, inMax, outMin, outMax) {
        return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
    }

    /** Normalised scroll progress 0 → 1 based on total scrollable height */
    function getScrollProgress() {
        return ScrollUtils.progress;
    }

    /* ─────────────────────────────────────────
       SHARED SCROLL STATE
    ───────────────────────────────────────── */

    const ScrollUtils = {
        lenis: null,
        scrollY: 0,
        lastScrollY: 0,
        velocity: 0,
        direction: 1,          // 1 = down, -1 = up
        progress: 0,           // 0 → 1
        maxScroll: 1,
        isReady: false,
        renderCallbacks: new Set(),
        scrollCallbacks: new Set(),

        // Expose helpers so other scripts can import them
        lerp,
        clamp,
        mapRange,
        getScrollProgress,
    };

    let maxScroll = 1;
    let needsRender = true;

    function measureScrollRange() {
        maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        ScrollUtils.maxScroll = maxScroll;
        ScrollUtils.progress = clamp(ScrollUtils.scrollY / maxScroll, 0, 1);
    }

    function updateScrollState(scroll, velocity, direction) {
        ScrollUtils.lastScrollY = ScrollUtils.scrollY;
        ScrollUtils.scrollY = scroll;
        ScrollUtils.velocity = velocity;
        ScrollUtils.direction = direction;
        ScrollUtils.progress = clamp(scroll / maxScroll, 0, 1);
        ScrollUtils.scrollCallbacks.forEach(function (callback) {
            callback(ScrollUtils);
        });
        needsRender = true;
    }

    function render() {
        if (!needsRender) return;
        needsRender = false;
        ScrollUtils.renderCallbacks.forEach(function (callback) {
            callback(ScrollUtils);
        });
    }

    ScrollUtils.addRenderCallback = function (callback) {
        ScrollUtils.renderCallbacks.add(callback);
        needsRender = true;
        return function () { ScrollUtils.renderCallbacks.delete(callback); };
    };

    ScrollUtils.addScrollCallback = function (callback) {
        ScrollUtils.scrollCallbacks.add(callback);
        return function () { ScrollUtils.scrollCallbacks.delete(callback); };
    };

    ScrollUtils.requestRender = function () {
        needsRender = true;
    };

    ScrollUtils.render = function () {
        needsRender = true;
        render();
    };

    ScrollUtils.measure = measureScrollRange;

    /* ─────────────────────────────────────────
       PAGE-LOADED CLASS
       Applied as early as possible so the
       body opacity-0 → opacity-1 transition
       fires correctly even when Lenis is slow.
    ───────────────────────────────────────── */

    function markPageLoaded() {
        document.body.classList.add('page-loaded');
    }

    /* ─────────────────────────────────────────
       LENIS INIT
    ───────────────────────────────────────── */

    function initLenis() {
        // Guard: Lenis CDN may not have loaded yet (e.g. browser blocked it).
        // If it didn't load fall back to native scroll and still mark page ready.
        if (typeof Lenis === 'undefined') {
            console.warn('[scroll-utils] Lenis not found – falling back to native scroll.');
            window.addEventListener('scroll', onNativeScroll, { passive: true });
            ScrollUtils.isReady = true;
            markPageLoaded();
            return;
        }

        const isInfiniteGallery = !!document.querySelector('.gallery-wrapper');
        if (isInfiniteGallery) {
            const spacer = document.querySelector('.scroll-spacer');
            if (spacer) spacer.style.height = `${Math.max(16000, window.innerHeight * 12)}px`;
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: function (t) {
                // Expo-out equivalent
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            },
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1.5,
            infinite: false,
        });

        ScrollUtils.lenis = lenis;
        measureScrollRange();

        if (isInfiniteGallery) {
            window.scrollTo(0, 0);
            ScrollUtils.scrollY = 0;
            ScrollUtils.lastScrollY = 0;
        }

        lenis.on('scroll', function (e) {
            updateScrollState(e.scroll, e.velocity, e.direction);
        });

        // One clock drives Lenis and all scroll rendering. GSAP ticker synchronizes with screen refresh rate.
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add(function (time) {
                lenis.raf(time * 1000);
                render();
            });
        } else {
            (function raf(time) {
                lenis.raf(time);
                render();
                requestAnimationFrame(raf);
            })(performance.now());
        }

        ScrollUtils.isReady = true;
        markPageLoaded();
    }

    /* Fallback for when Lenis is blocked */
    function onNativeScroll() {
        const scroll = window.scrollY;
        updateScrollState(scroll, scroll - ScrollUtils.scrollY, scroll >= ScrollUtils.scrollY ? 1 : -1);
        render();
    }

    /* ─────────────────────────────────────────
       BOOT
    ───────────────────────────────────────── */

    function boot() {
        // Always mark page loaded on DOMContentLoaded so the
        // body never stays invisible even if JS errors occur later.
        markPageLoaded();
        measureScrollRange();
        window.addEventListener('resize', function () {
            measureScrollRange();
            needsRender = true;
        }, { passive: true });

        // Lenis may still be loading (defer), wait for it.
        if (typeof Lenis !== 'undefined') {
            initLenis();
        } else {
            // Poll briefly for Lenis (max 3 s) then fall back.
            let attempts = 0;
            const timer = setInterval(function () {
                attempts++;
                if (typeof Lenis !== 'undefined') {
                    clearInterval(timer);
                    initLenis();
                } else if (attempts > 30) {
                    clearInterval(timer);
                    console.warn('[scroll-utils] Lenis never loaded – native scroll active.');
                    window.addEventListener('scroll', onNativeScroll, { passive: true });
                    ScrollUtils.isReady = true;
                }
            }, 100);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    /* ─────────────────────────────────────────
       EXPORT
    ───────────────────────────────────────── */

    window.ScrollUtils = ScrollUtils;

})();
