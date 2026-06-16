const mockTalents = [
    {
        name: "Alex River",
        role: "Creative Director — Paris",
        image: "asset/pics/Kozen 3.webp",
        layoutClass: "featured"
    },
    {
        name: "Sarah Chen",
        role: "AI Strategist — Tokyo",
        image: "asset/pics/Mockup.webp",
        layoutClass: "half-left"
    },
    {
        name: "David Owe",
        role: "Head of 3D — London",
        image: "asset/pics/Gearlab.webp",
        layoutClass: "half-right"
    },
    {
        name: "Mia Rossi",
        role: "Art Director — Milan",
        image: "asset/pics/Hako-10_0.webp",
        layoutClass: "center-small"
    },
    {
        name: "Kenji Sato",
        role: "Motion Designer — Kyoto",
        image: "asset/pics/9D6BE2F7-0FB4-404F-B5CC-BF0AAD47599A.webp",
        layoutClass: "half-left"
    }
];

class TalentsController {
    constructor() {
        this.grid = document.getElementById('talentsGrid');
        this.lenis = null;
    }

    init() {
        this.renderTalents();
        this.initLenis();
        this.initScrollReveal();
    }

    renderTalents() {
        const fragment = document.createDocumentFragment();
        mockTalents.forEach((talent) => {
            const card = document.createElement('div');
            card.className = `talent-card scroll-reveal ${talent.layoutClass}`;

            const imgWrap = document.createElement('div');
            imgWrap.className = 'talent-image-wrap';

            const img = document.createElement('img');
            img.src = talent.image;
            img.alt = talent.name;
            img.loading = 'lazy';
            img.width = 800;
            img.height = 1066;
            imgWrap.appendChild(img);

            const content = document.createElement('div');
            content.className = 'talent-content';

            const name = document.createElement('h2');
            name.className = 'talent-name';
            name.textContent = talent.name;

            const role = document.createElement('p');
            role.className = 'talent-role';
            role.textContent = talent.role;

            content.appendChild(name);
            content.appendChild(role);

            card.appendChild(imgWrap);
            card.appendChild(content);
            fragment.appendChild(card);
        });
        this.grid.appendChild(fragment);
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
        if (typeof ScrollTrigger !== 'undefined') {
            this.lenis.on('scroll', ScrollTrigger.update);
        }
    }

    initScrollReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        const revealElements = document.querySelectorAll('.scroll-reveal');
        revealElements.forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const ctrl = new TalentsController();
    ctrl.init();
});
