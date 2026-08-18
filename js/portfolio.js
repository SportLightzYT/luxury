/**
 * CREATREX — Portfolio Hub & Split Modal Controller
 * ------------------------------------------------------------
 * Manages the 2-sided split chooser popup modal (Portfolio vs Logofolio)
 */

(function () {
    'use strict';

    function initPortfolioModal() {
        const modal = document.getElementById('portSelectorModal');
        const openBtns = document.querySelectorAll('[data-open-port-modal]');
        const closeBtn = document.getElementById('closePortModalBtn');

        if (!modal) return;

        function openModal() {
            modal.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.classList.remove('is-active');
            document.body.style.overflow = '';
        }

        // Open modal automatically on landing
        openModal();

        // Bind open triggers
        openBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        });

        // Bind close button
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                closeModal();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('is-active')) {
                closeModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPortfolioModal);
    } else {
        initPortfolioModal();
    }
})();
