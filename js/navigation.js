(function () {
    'use strict';

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
            if (window.innerWidth > 768) setMenu(false);
        }, { passive: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        initNavigation();
    }
})();
