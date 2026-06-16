class ProjectsController {
    constructor() {
        this.projectsList = document.getElementById('projectsList');
        this.lenis = null;
    }

    init() {
        this.renderProjects();
        this.initLenis();
        this.initScrollReveal();
        this.bindEvents();
    }

    renderProjects() {
        const fragment = document.createDocumentFragment();
        const displayProjects = projects.slice(0, 10);

        displayProjects.forEach((p, idx) => {
            const row = document.createElement('div');
            row.className = 'project-row';
            row.dataset.projectIndex = idx;
            row.dataset.absIndex = idx;

            const numStr = String(idx + 1).padStart(2, '0');

            const textCol = document.createElement('div');
            textCol.className = 'project-text-col';

            const numWrap = document.createElement('div');
            numWrap.className = 'project-number-wrap';

            const numSpan = document.createElement('span');
            numSpan.className = 'project-number';
            numSpan.textContent = numStr;

            const kickerSpan = document.createElement('span');
            kickerSpan.className = 'project-kicker';
            kickerSpan.textContent = p.category;

            numWrap.appendChild(numSpan);
            numWrap.appendChild(kickerSpan);

            const title = document.createElement('h2');
            title.className = 'project-title';
            title.textContent = p.title;

            const meta = document.createElement('div');
            meta.className = 'project-meta';

            const metaClient = document.createElement('div');
            metaClient.className = 'project-meta-item';
            const clientLabel = document.createElement('span');
            clientLabel.className = 'project-meta-label';
            clientLabel.textContent = 'Client';
            const clientValue = document.createElement('span');
            clientValue.className = 'project-meta-value';
            clientValue.textContent = p.client;
            metaClient.appendChild(clientLabel);
            metaClient.appendChild(clientValue);

            const metaYear = document.createElement('div');
            metaYear.className = 'project-meta-item';
            const yearLabel = document.createElement('span');
            yearLabel.className = 'project-meta-label';
            yearLabel.textContent = 'Year';
            const yearValue = document.createElement('span');
            yearValue.className = 'project-meta-value';
            yearValue.textContent = p.year;
            metaYear.appendChild(yearLabel);
            metaYear.appendChild(yearValue);

            meta.appendChild(metaClient);
            meta.appendChild(metaYear);

            const tags = document.createElement('div');
            tags.className = 'project-tags';
            p.tags.forEach(t => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'project-tag';
                tagSpan.textContent = t;
                tags.appendChild(tagSpan);
            });

            textCol.appendChild(numWrap);
            textCol.appendChild(title);
            textCol.appendChild(meta);
            textCol.appendChild(tags);

            const imgCol = document.createElement('div');
            imgCol.className = 'project-image-col';
            const img = document.createElement('img');
            img.src = p.image;
            img.alt = p.title;
            img.loading = 'lazy';
            img.width = 1200;
            img.height = 800;
            imgCol.appendChild(img);

            row.appendChild(textCol);
            row.appendChild(imgCol);
            fragment.appendChild(row);
        });

        this.projectsList.appendChild(fragment);
    }

    initLenis() {
        if (typeof Lenis === 'undefined') return;
        this.lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            wheelMultiplier: 1.0,
            touchMultiplier: 2,
            infinite: false
        });
        const raf = (time) => {
            this.lenis.raf(time);
            requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        this.lenis.on('scroll', () => {
            this.updateCounter();
        });
        if (typeof ScrollTrigger !== 'undefined') {
            this.lenis.on('scroll', ScrollTrigger.update);
        }
    }

    initScrollReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        const rows = document.querySelectorAll('.project-row');
        rows.forEach(row => {
            gsap.fromTo(row,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: row,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }

    updateCounter() {
        const rows = Array.from(document.querySelectorAll('.project-row'));
        if (!rows.length) return;
        const viewportCenter = window.innerHeight / 2;
        let activeIdx = 0;
        let minDiff = Infinity;
        rows.forEach(row => {
            const rect = row.getBoundingClientRect();
            const rowCenter = rect.top + rect.height / 2;
            const diff = Math.abs(rowCenter - viewportCenter);
            if (diff < minDiff) {
                minDiff = diff;
                activeIdx = parseInt(row.dataset.absIndex);
            }
        });
        const c = String(activeIdx + 1).padStart(2, '0');
        const t = String(10).padStart(2, '0');
        document.querySelectorAll('#dvFooterCounter').forEach(el => {
            el.textContent = `${c} / ${t}`;
        });
    }

    bindEvents() {
        this.projectsList.addEventListener('click', (e) => {
            const row = e.target.closest('.project-row');
            if (row) {
                const idx = parseInt(row.dataset.projectIndex);
                if (!isNaN(idx)) {
                    document.body.style.opacity = '0';
                    setTimeout(() => {
                        window.location.href = `detail.html?id=${idx}`;
                    }, 400);
                }
            }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const ctrl = new ProjectsController();
    ctrl.init();
    setTimeout(() => ctrl.updateCounter(), 100);
});
