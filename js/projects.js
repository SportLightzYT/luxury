// ======================= PROJECTS PAGE LOGIC =======================
class ProjectsController {
    constructor() {
        this.projectsList = document.getElementById('projectsList');
        this.lenis = null;
    }

    init() {
        this.renderProjects();
        this.initLenis();
        this.initScrollReveal();
        this.initCounterObserver();
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
        if (typeof ScrollManager === 'undefined') return;
        this.scrollManager = new ScrollManager();
        this.scrollManager.init();
        this.lenis = this.scrollManager.getLenis();
    }

    initCounterObserver() {
        const rows = Array.from(document.querySelectorAll('.project-row'));
        if (!rows.length) return;

        const ratios = new Map();
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => ratios.set(entry.target, entry.intersectionRatio));
            let bestRow = rows[0];
            let bestRatio = 0;
            rows.forEach(row => {
                const ratio = ratios.get(row) || 0;
                if (ratio > bestRatio) {
                    bestRatio = ratio;
                    bestRow = row;
                }
            });
            if (bestRatio > 0) {
                const activeIdx = parseInt(bestRow.dataset.absIndex);
                const c = String(activeIdx + 1).padStart(2, '0');
                const t = String(10).padStart(2, '0');
                document.querySelectorAll('#dvFooterCounter').forEach(el => {
                    el.textContent = `${c} / ${t}`;
                });
            }
        }, { threshold: [0, 0.25, 0.5, 0.75, 1] });

        rows.forEach(row => observer.observe(row));
        this.counterObserver = observer;
    }

    initScrollReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
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
});