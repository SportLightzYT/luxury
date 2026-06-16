// ======================= SERVICES PAGE (NATIVE SMOOTH SCROLL) =======================

class ServicesController {
    constructor() {
        this.lenis = null;
    }

    init() {
        this.initLenis();
        this.initScrollReveal();
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
    const ctrl = new ServicesController();
    ctrl.init();
});
