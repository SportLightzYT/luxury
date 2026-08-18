/**
 * CREATREX — Seamless Logofolio Continuous Reader (Zero-Gap)
 * ------------------------------------------------------------
 * 49 curated high-resolution WebP pages stacked seamlessly with 0px spacing.
 * Instant initial load + native lazy loading + IntersectionObserver page tracking.
 */

(function () {
    'use strict';

    const PAGES = [
        { index: 1, pageNum: 1, src: 'asset/logofolio-pages/page_01_num_01.webp' },
        { index: 2, pageNum: 4, src: 'asset/logofolio-pages/page_02_num_04.webp' },
        { index: 3, pageNum: 6, src: 'asset/logofolio-pages/page_03_num_06.webp' },
        { index: 4, pageNum: 7, src: 'asset/logofolio-pages/page_04_num_07.webp' },
        { index: 5, pageNum: 8, src: 'asset/logofolio-pages/page_05_num_08.webp' },
        { index: 6, pageNum: 9, src: 'asset/logofolio-pages/page_06_num_09.webp' },
        { index: 7, pageNum: 10, src: 'asset/logofolio-pages/page_07_num_10.webp' },
        { index: 8, pageNum: 11, src: 'asset/logofolio-pages/page_08_num_11.webp' },
        { index: 9, pageNum: 12, src: 'asset/logofolio-pages/page_09_num_12.webp' },
        { index: 10, pageNum: 16, src: 'asset/logofolio-pages/page_10_num_16.webp' },
        { index: 11, pageNum: 17, src: 'asset/logofolio-pages/page_11_num_17.webp' },
        { index: 12, pageNum: 20, src: 'asset/logofolio-pages/page_12_num_20.webp' },
        { index: 13, pageNum: 21, src: 'asset/logofolio-pages/page_13_num_21.webp' },
        { index: 14, pageNum: 24, src: 'asset/logofolio-pages/page_14_num_24.webp' },
        { index: 15, pageNum: 25, src: 'asset/logofolio-pages/page_15_num_25.webp' },
        { index: 16, pageNum: 26, src: 'asset/logofolio-pages/page_16_num_26.webp' },
        { index: 17, pageNum: 27, src: 'asset/logofolio-pages/page_17_num_27.webp' },
        { index: 18, pageNum: 28, src: 'asset/logofolio-pages/page_18_num_28.webp' },
        { index: 19, pageNum: 30, src: 'asset/logofolio-pages/page_19_num_30.webp' },
        { index: 20, pageNum: 31, src: 'asset/logofolio-pages/page_20_num_31.webp' },
        { index: 21, pageNum: 32, src: 'asset/logofolio-pages/page_21_num_32.webp' },
        { index: 22, pageNum: 33, src: 'asset/logofolio-pages/page_22_num_33.webp' },
        { index: 23, pageNum: 36, src: 'asset/logofolio-pages/page_23_num_36.webp' },
        { index: 24, pageNum: 37, src: 'asset/logofolio-pages/page_24_num_37.webp' },
        { index: 25, pageNum: 40, src: 'asset/logofolio-pages/page_25_num_40.webp' },
        { index: 26, pageNum: 41, src: 'asset/logofolio-pages/page_26_num_41.webp' },
        { index: 27, pageNum: 43, src: 'asset/logofolio-pages/page_27_num_43.webp' },
        { index: 28, pageNum: 45, src: 'asset/logofolio-pages/page_28_num_45.webp' },
        { index: 29, pageNum: 46, src: 'asset/logofolio-pages/page_29_num_46.webp' },
        { index: 30, pageNum: 47, src: 'asset/logofolio-pages/page_30_num_47.webp' },
        { index: 31, pageNum: 49, src: 'asset/logofolio-pages/page_31_num_49.webp' },
        { index: 32, pageNum: 50, src: 'asset/logofolio-pages/page_32_num_50.webp' },
        { index: 33, pageNum: 51, src: 'asset/logofolio-pages/page_33_num_51.webp' },
        { index: 34, pageNum: 53, src: 'asset/logofolio-pages/page_34_num_53.webp' },
        { index: 35, pageNum: 56, src: 'asset/logofolio-pages/page_35_num_56.webp' },
        { index: 36, pageNum: 57, src: 'asset/logofolio-pages/page_36_num_57.webp' },
        { index: 37, pageNum: 60, src: 'asset/logofolio-pages/page_37_num_60.webp' },
        { index: 38, pageNum: 61, src: 'asset/logofolio-pages/page_38_num_61.webp' },
        { index: 39, pageNum: 64, src: 'asset/logofolio-pages/page_39_num_64.webp' },
        { index: 40, pageNum: 65, src: 'asset/logofolio-pages/page_40_num_65.webp' },
        { index: 41, pageNum: 66, src: 'asset/logofolio-pages/page_41_num_66.webp' },
        { index: 42, pageNum: 67, src: 'asset/logofolio-pages/page_42_num_67.webp' },
        { index: 43, pageNum: 69, src: 'asset/logofolio-pages/page_43_num_69.webp' },
        { index: 44, pageNum: 70, src: 'asset/logofolio-pages/page_44_num_70.webp' },
        { index: 45, pageNum: 71, src: 'asset/logofolio-pages/page_45_num_71.webp' },
        { index: 46, pageNum: 72, src: 'asset/logofolio-pages/page_46_num_72.webp' },
        { index: 47, pageNum: 73, src: 'asset/logofolio-pages/page_47_num_73.webp' },
        { index: 48, pageNum: 76, src: 'asset/logofolio-pages/page_48_num_76.webp' },
        { index: 49, pageNum: 77, src: 'asset/logofolio-pages/page_49_num_77.webp' }
    ];

    const viewer = document.getElementById('pdfViewer');
    const statusEl = document.getElementById('pdfStatus');
    const pageCountEl = document.getElementById('pdfPageCount');
    const footerCounter = document.getElementById('dvFooterCounter');

    function updateStatus(text) {
        if (statusEl) statusEl.textContent = text;
    }

    function updatePageCount(current, total) {
        const str = `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
        if (pageCountEl) pageCountEl.textContent = str;
        if (footerCounter) footerCounter.textContent = str;
    }

    function initLogofolioViewer() {
        if (!viewer) return;

        viewer.innerHTML = '';
        const total = PAGES.length;
        updateStatus('Ready · Seamless Document');
        updatePageCount(1, total);

        const fragment = document.createDocumentFragment();

        PAGES.forEach((item, i) => {
            const pageSection = document.createElement('section');
            pageSection.className = 'pdf-page is-rendered';
            pageSection.dataset.pageIndex = String(item.index);
            pageSection.dataset.pageNumber = String(item.pageNum);
            pageSection.setAttribute('aria-label', `Logofolio Page ${item.pageNum} (${item.index} of ${total})`);
            pageSection.style.position = 'relative';
            pageSection.style.width = '100%';
            pageSection.style.margin = '0';
            pageSection.style.padding = '0';
            pageSection.style.lineHeight = '0';
            pageSection.style.fontSize = '0';
            pageSection.style.border = '0';
            pageSection.style.overflow = 'hidden';

            const img = document.createElement('img');
            img.src = item.src;
            img.alt = `Logofolio 2026 — Page ${item.pageNum}`;
            img.loading = i < 4 ? 'eager' : 'lazy';
            img.decoding = 'async';
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            img.style.verticalAlign = 'bottom';
            img.style.margin = '0';
            img.style.padding = '0';
            img.style.border = '0';
            img.style.position = 'relative';
            img.style.zIndex = '2';

            pageSection.appendChild(img);
            fragment.appendChild(pageSection);
        });

        viewer.appendChild(fragment);

        // Track active page on scroll
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.dataset.pageIndex) || 1;
                        updatePageCount(index, total);
                    }
                });
            }, {
                root: null,
                threshold: 0.25
            });

            viewer.querySelectorAll('.pdf-page').forEach((el) => {
                observer.observe(el);
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLogofolioViewer);
    } else {
        initLogofolioViewer();
    }
})();
