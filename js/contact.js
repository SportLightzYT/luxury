// ======================= CONTACT PAGE LOGIC =======================

class ContactController {
    constructor() {
        this.lenis = null;
    }

    init() {
        this.initLenis();
        this.initScrollReveal();
        this.initTimeclocks();
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

    initTimeclocks() {
        const updateClocks = () => {
            const now = new Date();
            const options = { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false };
            const timeStr = new Intl.DateTimeFormat('en-GB', options).format(now);
            document.querySelectorAll('.local-time').forEach(el => {
                el.textContent = timeStr + ' CET';
            });
        };
        updateClocks();
        setInterval(updateClocks, 60000);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const ctrl = new ContactController();
    ctrl.init();
});
