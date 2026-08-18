/**
 * CREATREX — Continuous PDF Reader (WEB-FIRST)
 * ------------------------------------------------------------
 * 1) Loads 2026.pdf from the website first.
 * 2) If the page is opened locally (file://) or the web PDF fails,
 *    the "Open PDF from this device" button can load a local PDF.
 * 3) Renders every PDF page as a canvas — NO iframe/embed/object.
 * 4) Responsive + mobile-friendly continuous scrolling.
 */

(function () {
    'use strict';

    const PDF_URL = '2026.pdf';

    const PDFJS_VERSION = '3.11.174';

    const PDFJS_SRC =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`;

    const PDFJS_WORKER =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`;

    const MAX_DPR = 2;
    const PRELOAD_DISTANCE = 1600;
    const RESIZE_DEBOUNCE = 180;

    const viewer = document.getElementById('pdfViewer');
    const statusEl = document.getElementById('pdfStatus');
    const pageCountEl = document.getElementById('pdfPageCount');
    const fileButton = document.getElementById('pdfFileButton');
    const fileInput = document.getElementById('pdfFileInput');
    const downloadLink = document.querySelector('.pdf-download');

    const pageRecords = new Map();

    let pdfjsLib = null;
    let pdf = null;
    let observer = null;
    let resizeTimer = null;
    let renderQueue = Promise.resolve();
    let currentSource = null;

    function setStatus(text) {
        if (statusEl) {
            statusEl.textContent = text;
        }
    }

    function setPageCount(text) {
        if (pageCountEl) {
            pageCountEl.textContent = text;
        }
    }

    function showError(message) {
        if (!viewer) return;

        viewer.innerHTML = `
            <div class="pdf-noscript">
                <strong>ไม่สามารถโหลด PDF ได้</strong><br>
                ${message}
            </div>
        `;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {

            if (window.pdfjsLib) {
                resolve(window.pdfjsLib);
                return;
            }

            const existing = document.querySelector(
                'script[data-creatrex-pdfjs="true"]'
            );

            if (existing) {
                existing.addEventListener(
                    'load',
                    () => resolve(window.pdfjsLib),
                    { once: true }
                );

                existing.addEventListener(
                    'error',
                    () => reject(new Error('PDF.js failed to load')),
                    { once: true }
                );

                return;
            }

            const script = document.createElement('script');

            script.src = src;
            script.async = true;
            script.dataset.creatrexPdfjs = 'true';

            script.onload = () => {

                if (window.pdfjsLib) {
                    resolve(window.pdfjsLib);
                } else {
                    reject(
                        new Error(
                            'PDF.js loaded but pdfjsLib is missing'
                        )
                    );
                }
            };

            script.onerror = () => {
                reject(
                    new Error(
                        'Unable to load PDF.js from CDN'
                    )
                );
            };

            document.head.appendChild(script);
        });
    }

    async function ensurePdfJs() {

        if (pdfjsLib) {
            return pdfjsLib;
        }

        pdfjsLib = await loadScript(PDFJS_SRC);

        pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;

        return pdfjsLib;
    }

    async function destroyCurrentPdf() {

        if (observer) {
            observer.disconnect();
            observer = null;
        }

        try {
            await renderQueue;
        } catch (_) {
        }

        if (pdf) {
            try {
                await pdf.destroy();
            } catch (_) {
            }
        }

        pdf = null;
        currentSource = null;

        pageRecords.clear();

        if (viewer) {
            viewer.innerHTML = '';
        }
    }

    function getViewerWidth() {

        if (!viewer) {
            return 320;
        }

        const width = viewer.getBoundingClientRect().width;

        return Math.max(
            240,
            Math.floor(width)
        );
    }

    function makePageWrapper(number, ratio) {

        const wrapper = document.createElement('section');

        wrapper.className =
            'pdf-page is-loading';

        wrapper.dataset.pageNumber =
            String(number);

        wrapper.setAttribute(
            'aria-label',
            `PDF page ${number}`
        );

        wrapper.style.aspectRatio =
            `${ratio.width} / ${ratio.height}`;

        return wrapper;
    }

    function getScaleForWidth(page, width) {

        const baseViewport =
            page.getViewport({
                scale: 1
            });

        return width / baseViewport.width;
    }

    function cancelRender(entry) {

        if (
            entry &&
            entry.renderTask
        ) {
            try {
                entry.renderTask.cancel();
            } catch (_) {
            }

            entry.renderTask = null;
        }
    }

    function releaseCanvas(entry) {

        if (
            !entry ||
            !entry.canvas
        ) {
            return;
        }

        cancelRender(entry);

        entry.canvas.remove();

        entry.canvas = null;
        entry.renderedWidth = 0;

        entry.wrapper.classList.remove(
            'is-rendered'
        );

        entry.wrapper.classList.add(
            'is-loading'
        );
    }

    async function renderPage(entry, force) {

        if (!pdf || !entry) {
            return;
        }

        if (entry.rendering) {
            return;
        }

        const width = getViewerWidth();

        if (
            !force &&
            entry.canvas &&
            Math.abs(
                entry.renderedWidth - width
            ) < 8
        ) {
            return;
        }

        entry.rendering = true;

        entry.wrapper.classList.add(
            'is-loading'
        );

        try {

            const page =
                entry.page ||
                await pdf.getPage(entry.number);

            entry.page = page;

            const scale =
                getScaleForWidth(
                    page,
                    width
                );

            const dpr =
                Math.min(
                    window.devicePixelRatio || 1,
                    MAX_DPR
                );

            const cssViewport =
                page.getViewport({
                    scale
                });

            const outputViewport =
                page.getViewport({
                    scale: scale * dpr
                });

            let canvas = entry.canvas;

            if (!canvas) {

                canvas =
                    document.createElement(
                        'canvas'
                    );

                canvas.className =
                    'pdf-page-canvas';

                canvas.setAttribute(
                    'aria-hidden',
                    'true'
                );

                entry.wrapper.appendChild(
                    canvas
                );

                entry.canvas = canvas;
            }

            canvas.width =
                Math.max(
                    1,
                    Math.ceil(
                        outputViewport.width
                    )
                );

            canvas.height =
                Math.max(
                    1,
                    Math.ceil(
                        outputViewport.height
                    )
                );

            canvas.style.width =
                `${cssViewport.width}px`;

            canvas.style.height =
                `${cssViewport.height}px`;

            entry.wrapper.style.aspectRatio =
                `${cssViewport.width} / ${cssViewport.height}`;

            const ctx =
                canvas.getContext(
                    '2d',
                    {
                        alpha: false,
                        desynchronized: true
                    }
                );

            ctx.fillStyle = '#ffffff';

            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            cancelRender(entry);

            const renderTask =
                page.render({
                    canvasContext: ctx,
                    viewport: outputViewport,
                    intent: 'display',
                    background: '#ffffff'
                });

            entry.renderTask =
                renderTask;

            await renderTask.promise;

            entry.renderTask = null;

            entry.renderedWidth =
                width;

            entry.wrapper.classList.remove(
                'is-loading'
            );

            entry.wrapper.classList.add(
                'is-rendered'
            );

        } catch (error) {

            if (
                error &&
                error.name ===
                    'RenderingCancelledException'
            ) {
                return;
            }

            console.error(
                `CREATREX PDF: page ${entry.number} render failed`,
                error
            );

        } finally {

            entry.rendering = false;

            entry.renderTask = null;
        }
    }

    function queueRender(
        entry,
        force = false
    ) {

        if (!entry) {
            return Promise.resolve();
        }

        renderQueue =
            renderQueue
                .then(() =>
                    renderPage(
                        entry,
                        force
                    )
                )
                .catch(error => {

                    console.error(
                        'CREATREX PDF render queue error:',
                        error
                    );

                });

        return renderQueue;
    }

    function setupIntersectionObserver() {

        if (observer) {
            observer.disconnect();
        }

        observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(item => {

                        const number =
                            Number(
                                item.target.dataset
                                    .pageNumber
                            );

                        const record =
                            pageRecords.get(
                                number
                            );

                        if (!record) {
                            return;
                        }

                        if (
                            item.isIntersecting
                        ) {

                            queueRender(
                                record
                            );

                            return;
                        }

                        const rect =
                            item.boundingClientRect;

                        const viewportHeight =
                            window.innerHeight ||
                            document.documentElement
                                .clientHeight;

                        const farAway =
                            rect.bottom <
                                -PRELOAD_DISTANCE ||
                            rect.top >
                                viewportHeight +
                                    PRELOAD_DISTANCE;

                        if (farAway) {
                            releaseCanvas(
                                record
                            );
                        }

                    });

                },
                {
                    root: null,

                    rootMargin:
                        `${PRELOAD_DISTANCE}px 0px`,

                    threshold: 0.01
                }
            );

        pageRecords.forEach(
            record => {

                observer.observe(
                    record.wrapper
                );

            }
        );
    }

    async function buildPageList() {

        viewer.innerHTML = '';

        pageRecords.clear();

        for (
            let number = 1;
            number <= pdf.numPages;
            number++
        ) {

            const page =
                await pdf.getPage(
                    number
                );

            const baseViewport =
                page.getViewport({
                    scale: 1
                });

            const wrapper =
                makePageWrapper(
                    number,
                    {
                        width:
                            baseViewport.width,

                        height:
                            baseViewport.height
                    }
                );

            viewer.appendChild(
                wrapper
            );

            pageRecords.set(
                number,
                {
                    number,

                    page,

                    wrapper,

                    canvas: null,

                    renderedWidth: 0,

                    rendering: false,

                    renderTask: null
                }
            );
        }

        setPageCount(
            `${pdf.numPages} pages`
        );

        setupIntersectionObserver();

        if (pageRecords.has(1)) {

            await queueRender(
                pageRecords.get(1),
                true
            );
        }

        if (pageRecords.has(2)) {

            queueRender(
                pageRecords.get(2),
                true
            );
        }
    }

    async function openPdfDocument(
        source,
        label
    ) {

        const lib =
            await ensurePdfJs();

        await destroyCurrentPdf();

        setStatus(
            `Loading ${label}…`
        );

        setPageCount(
            '0 / 0'
        );

        let loadingTask;

        if (
            typeof source === 'string'
        ) {

            loadingTask =
                lib.getDocument({

                    url: source,

                    useWorkerFetch: true,

                    isEvalSupported: true,

                    verbosity: 0

                });

        } else {

            const bytes =
                new Uint8Array(
                    await source.arrayBuffer()
                );

            loadingTask =
                lib.getDocument({

                    data: bytes,

                    useWorkerFetch: false,

                    isEvalSupported: true,

                    verbosity: 0

                });
        }

        pdf =
            await loadingTask.promise;

        currentSource = label;

        setStatus('Ready');

        await buildPageList();
    }

    async function loadWebPdf() {

        const isLocalFile =
            window.location.protocol ===
            'file:';

        /*
         * Important:
         * Do not try to fetch a relative PDF
         * from file:// because browsers can block it.
         */
        if (isLocalFile) {

            setStatus(
                'Choose PDF file'
            );

            setPageCount('');

            if (fileButton) {
                fileButton.removeAttribute(
                    'hidden'
                );
            }

            return false;
        }

        try {

            setStatus(
                'Loading PDF from website…'
            );

            await openPdfDocument(
                PDF_URL,
                PDF_URL
            );

            if (downloadLink) {
                downloadLink.href =
                    PDF_URL;
            }

            return true;

        } catch (error) {

            console.error(
                'CREATREX PDF web load failed:',
                error
            );

            setStatus(
                'Web PDF unavailable'
            );

            setPageCount('');

            if (fileButton) {

                fileButton.removeAttribute(
                    'hidden'
                );

                fileButton.textContent =
                    'Open PDF from this device';
            }

            return false;
        }
    }

    async function loadLocalFile(file) {

        if (!file) {
            return;
        }

        if (
            file.type &&
            file.type !==
                'application/pdf' &&
            !file.name
                .toLowerCase()
                .endsWith('.pdf')
        ) {

            setStatus(
                'Please choose a PDF file'
            );

            return;
        }

        try {

            setStatus(
                `Opening ${file.name}…`
            );

            await openPdfDocument(
                file,
                file.name
            );

            if (downloadLink) {

                const objectUrl =
                    URL.createObjectURL(
                        file
                    );

                downloadLink.href =
                    objectUrl;

                downloadLink.download =
                    file.name;

                downloadLink.textContent =
                    'Download selected PDF ↗';
            }

        } catch (error) {

            console.error(
                'CREATREX PDF local load failed:',
                error
            );

            setStatus(
                'Unable to open PDF'
            );

            setPageCount('');

            showError(
                'ไฟล์ PDF อาจเสียหาย หรือเบราว์เซอร์ไม่สามารถอ่านไฟล์นี้ได้'
            );
        }
    }

    function bindLocalFilePicker() {

        if (
            !fileButton ||
            !fileInput
        ) {
            return;
        }

        fileButton.addEventListener(
            'click',
            () => {

                fileInput.click();

            }
        );

        fileInput.addEventListener(
            'change',
            () => {

                const file =
                    fileInput.files &&
                    fileInput.files[0];

                if (file) {
                    loadLocalFile(
                        file
                    );
                }
            }
        );
    }

    function handleResize() {

        clearTimeout(
            resizeTimer
        );

        resizeTimer =
            setTimeout(
                () => {

                    if (!pdf) {
                        return;
                    }

                    const viewportHeight =
                        window.innerHeight ||
                        document.documentElement
                            .clientHeight;

                    pageRecords.forEach(
                        entry => {

                            const rect =
                                entry.wrapper
                                    .getBoundingClientRect();

                            const nearViewport =
                                rect.bottom >
                                    -PRELOAD_DISTANCE &&
                                rect.top <
                                    viewportHeight +
                                        PRELOAD_DISTANCE;

                            if (
                                nearViewport &&
                                entry.canvas
                            ) {

                                queueRender(
                                    entry,
                                    true
                                );
                            }
                        }
                    );

                },
                RESIZE_DEBOUNCE
            );
    }

    async function init() {

        if (!viewer) {
            return;
        }

        bindLocalFilePicker();

        /*
         * WEB-FIRST:
         *
         * On website:
         *     archive.html -> 2026.pdf
         *
         * On file://:
         *     wait for local PDF picker
         */
        const loaded =
            await loadWebPdf();

        if (
            !loaded &&
            window.location.protocol !==
                'file:'
        ) {

            setStatus(
                'Choose PDF file'
            );
        }
    }

    window.addEventListener(
        'resize',
        handleResize,
        {
            passive: true
        }
    );

    document.addEventListener(
        'DOMContentLoaded',
        init
    );

})();