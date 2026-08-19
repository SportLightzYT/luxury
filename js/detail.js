// ======================= DETAIL VIEW =======================
class DetailView {
    constructor() {
        this.heroImage = document.getElementById('dvHeroImage');
        this.heroCaption = document.getElementById('dvHeroCaption');
        this.galleryEl = document.getElementById('dvGallery');
        this.footerCounterEl = document.getElementById('dvFooterCounter');
        this.closeBtn = document.getElementById('dvClose');

        // GIFs ศิลปะ/กราฟฟิกดีไซน์ - จากแหล่งที่เชื่อถือได้
        this.gifPool = [
            'https://media.giphy.com/media/l0HlGx4A5Bpk6jCZq/giphy.gif',
            'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
            'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
            'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif',
            'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif',
            'https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif',
            'https://media.giphy.com/media/l0HlGx4A5Bpk6jCZq/giphy.gif',
            'https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif'
        ];

        // Hover effects ที่สลับกัน
        this.hoverEffects = ['effect-zoom', 'effect-blur', 'effect-color', 'effect-tilt', 'effect-chromatic'];

        this.bindEvents();
    }

    bindEvents() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (typeof window.navigateToPage === 'function') {
                    window.navigateToPage('index.html');
                } else {
                    window.location.href = 'index.html';
                }
            });
        }
        window.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                if (typeof window.navigateToPage === 'function') {
                    window.navigateToPage('index.html');
                } else {
                    window.location.href = 'index.html';
                }
            }
        });
    }

    render(idx) {
        if (!projects || !projects[idx]) return;
        const p = projects[idx];
        const c = String(idx + 1).padStart(2, '0');
        const t = String(projects.length).padStart(2, '0');

        if (this.heroImage) {
            this.heroImage.src = p.image;
            this.heroImage.alt = p.title;
        }
        if (this.heroCaption) {
            this.heroCaption.textContent = `${p.title} — ${p.year}`;
        }
        if (this.footerCounterEl) {
            this.footerCounterEl.textContent = `${c} / ${t}`;
        }

        this.buildGallery(idx);
    }

    buildGallery(projectIdx) {
        if (!this.galleryEl || !projects[projectIdx]) return;
        const p = projects[projectIdx];

        const allImages = [p.image, ...galleryExtra];
        const shuffled = this.shuffleArray([...allImages]);

        // Layouts - ซ้ายขวาเท่ากัน
        const rowConfigs = [
            { layout: 'layout-1', ratios: ['ratio-landscape', 'ratio-landscape'] },      // 2 รูป landscape เท่ากัน
            { layout: 'layout-2', ratios: ['ratio-portrait', 'ratio-portrait'] },      // 2 รูป portrait เท่ากัน
            { layout: 'layout-3', ratios: ['ratio-wide'] },                                // 1 รูปเต็ม
            { layout: 'layout-5', ratios: ['ratio-square', 'ratio-square'] },           // 2 รูป square เท่ากัน
            { layout: 'layout-4', ratios: ['ratio-portrait', 'ratio-portrait', 'ratio-portrait'] }, // 3 รูป portrait
            { layout: 'layout-1', ratios: ['ratio-tall', 'ratio-tall'] },                // 2 รูป tall เท่ากัน
            { layout: 'layout-2', ratios: ['ratio-landscape', 'ratio-landscape'] },    // 2 รูป landscape
            { layout: 'layout-3', ratios: ['ratio-square'] },                           // 1 รูป square เต็ม
        ];

        this.galleryEl.innerHTML = '';

        let imgIndex = 0;
        let gifIndex = 0;
        let effectIndex = 0;

        rowConfigs.forEach((config, rowIdx) => {
            const row = document.createElement('div');
            row.className = `gallery-row ${config.layout}`;

            config.ratios.forEach((ratio, itemIdx) => {
                const isGif = Math.random() < 0.25;

                const item = document.createElement('div');
                // สลับ hover effect
                const effectClass = this.hoverEffects[effectIndex % this.hoverEffects.length];
                effectIndex++;

                item.className = `gallery-item ${ratio} ${effectClass}`;

                if (isGif) {
                    const gifUrl = this.gifPool[gifIndex % this.gifPool.length];
                    gifIndex++;

                    const img = document.createElement('img');
                    img.src = gifUrl;
                    img.alt = `${p.title} — Motion ${String(rowIdx * config.ratios.length + itemIdx + 1).padStart(2, '0')}`;
                    img.loading = 'lazy';

                    const badge = document.createElement('span');
                    badge.className = 'gif-badge';
                    badge.textContent = 'Motion';

                    item.appendChild(img);
                    item.appendChild(badge);
                } else {
                    const imgSrc = shuffled[imgIndex % shuffled.length];
                    imgIndex++;

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `${p.title} — Frame ${String(rowIdx * config.ratios.length + itemIdx + 1).padStart(2, '0')}`;
                    img.loading = 'lazy';

                    item.appendChild(img);
                }

                const label = document.createElement('span');
                label.className = 'gallery-label';
                label.textContent = `${p.title} — ${String(rowIdx * config.ratios.length + itemIdx + 1).padStart(2, '0')}`;
                item.appendChild(label);

                row.appendChild(item);
            });

            this.galleryEl.appendChild(row);
        });

        this.initScrollAnimations();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    initScrollAnimations() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            const rows = this.galleryEl.querySelectorAll('.gallery-row');
            rows.forEach((row, i) => {
                gsap.fromTo(row,
                    { opacity: 0, y: 100, scale: 0.98 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 1.4,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: row,
                            start: 'top 88%',
                            toggleActions: 'play none none none'
                        },
                        delay: i * 0.06
                    }
                );
            });

            const items = this.galleryEl.querySelectorAll('.gallery-item img');
            items.forEach(img => {
                gsap.to(img, {
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5
                    }
                });
            });

            const footerReveals = document.querySelectorAll('.footer-reveal');
            footerReveals.forEach((el, i) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 40 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: 'expo.out',
                        scrollTrigger: {
                            trigger: el,
                            start: 'top 92%',
                            toggleActions: 'play none none none'
                        },
                        delay: i * 0.1
                    }
                );
            });
        } else {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '80px 0px' });

            this.galleryEl.querySelectorAll('.gallery-row').forEach(el => {
                observer.observe(el);
            });

            document.querySelectorAll('.footer-reveal').forEach(el => {
                observer.observe(el);
            });
        }
    }
}

// ======================= FOOTER LETTER ANIMATION =======================
function initFooterWord() {
    const footerWord = document.getElementById('dvFooterWord');
    if (!footerWord) return;

    const text = footerWord.textContent;
    footerWord.innerHTML = '';

    const chars = text.split('');
    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;

        const ax = (Math.random() - 0.5) * 6;
        const ay = (Math.random() - 0.5) * 4;
        const ar = (Math.random() - 0.5) * 3;

        span.style.setProperty('--ax', ax + 'px');
        span.style.setProperty('--ay', ay + 'px');
        span.style.setProperty('--ar', ar + 'deg');

        footerWord.appendChild(span);
    });
}

// ======================= INIT =======================
window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');

    const view = new DetailView();

    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    view.render(!isNaN(id) ? id : 0);

    initFooterWord();
});