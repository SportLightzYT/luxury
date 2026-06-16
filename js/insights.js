const mockInsights = [
    {
        title: "The Death of the Original in the Age of AI",
        category: "Opinion",
        date: "June 2026",
        excerpt: "In an era where AI can synthesize a thousand years of art history in milliseconds, the concept of the 'original' is fading. What does this mean for luxury brands built on heritage?",
        image: "asset/pics/Brand Guidelines 1.0_0_png.webp",
        layoutClass: "featured"
    },
    {
        title: "Sensory Branding in Digital Spaces",
        category: "Future Trends",
        date: "May 2026",
        excerpt: "How do we translate the tactile experience of luxury silk or brushed steel into the virtual realm? The next frontier of digital fashion lies in the haptic experience.",
        image: "asset/pics/9D6BE2F7-0FB4-404F-B5CC-BF0AAD47599A.webp",
        layoutClass: "half portrait"
    },
    {
        title: "Architecture as Identity",
        category: "Design",
        date: "April 2026",
        excerpt: "Analyzing the global shift towards brutalist minimalism in flagship retail stores, and why empty space has become the ultimate luxury.",
        image: "asset/pics/Kodangs Mockup33_0.webp",
        layoutClass: "half landscape"
    },
    {
        title: "Motion & Emotion: The New Cinema",
        category: "Production",
        date: "March 2026",
        excerpt: "Why static campaigns are failing to capture Gen Z luxury consumers, and how 1000fps slow-motion is filling the emotional gap.",
        image: "asset/pics/Hako-10_0.webp",
        layoutClass: "third portrait"
    },
    {
        title: "The Return of Analog Texture",
        category: "Photography",
        date: "February 2026",
        excerpt: "In a world saturated with hyper-perfect CGI, the imperfections of medium format film are making an aggressive comeback.",
        image: "asset/pics/Mockup.webp",
        layoutClass: "third landscape"
    },
    {
        title: "Sonic Branding: The Invisible Logo",
        category: "Strategy",
        date: "January 2026",
        excerpt: "If your brand had a sound, what would it be? Exploring the rise of bespoke audio identities for high-end fashion houses.",
        image: "asset/pics/Gearlab.webp",
        layoutClass: "third portrait"
    },
    {
        title: "Archival Revival",
        category: "Culture",
        date: "December 2025",
        excerpt: "How brands are monetizing their own history by treating past collections as museum artifacts rather than out-of-season stock.",
        image: "asset/pics/Brand Guidelines 1.0_0.webp",
        layoutClass: "offset landscape"
    }
];

class InsightsController {
    constructor() {
        this.grid = document.getElementById('insightsGrid');
        this.lenis = null;
    }

    init() {
        this.renderInsights();
        this.initLenis();
        this.initScrollReveal();
    }

    renderInsights() {
        const fragment = document.createDocumentFragment();
        mockInsights.forEach((post) => {
            const article = document.createElement('a');
            article.href = '#';
            article.className = `insight-card scroll-reveal ${post.layoutClass}`;

            const imgWrap = document.createElement('div');
            imgWrap.className = 'insight-image-wrap';

            const img = document.createElement('img');
            img.src = post.image;
            img.alt = post.title;
            img.loading = 'lazy';
            img.width = 800;
            img.height = 600;
            imgWrap.appendChild(img);

            const content = document.createElement('div');
            content.className = 'insight-content';

            const meta = document.createElement('div');
            meta.className = 'insight-meta';

            const dateSpan = document.createElement('span');
            dateSpan.textContent = post.date;

            const dotSpan = document.createElement('span');
            dotSpan.className = 'dot';

            const catSpan = document.createElement('span');
            catSpan.textContent = post.category;

            meta.appendChild(dateSpan);
            meta.appendChild(dotSpan);
            meta.appendChild(catSpan);

            const title = document.createElement('h2');
            title.className = 'insight-title';
            title.textContent = post.title;

            const excerpt = document.createElement('p');
            excerpt.className = 'insight-excerpt';
            excerpt.textContent = post.excerpt;

            const readMore = document.createElement('span');
            readMore.className = 'insight-read-more';
            readMore.textContent = 'Read Article';

            content.appendChild(meta);
            content.appendChild(title);
            content.appendChild(excerpt);
            content.appendChild(readMore);

            article.appendChild(imgWrap);
            article.appendChild(content);
            fragment.appendChild(article);
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
    const ctrl = new InsightsController();
    ctrl.init();
});
