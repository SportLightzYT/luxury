// ======================= SERVICES PAGE LOGIC =======================
class ServicesController {
    constructor() {
        this.lenis = null;
    }

    init() {
        this.initLenis();
        this.initScrollReveal();
    }

    initLenis() {
        if (typeof ScrollManager === 'undefined') return;
        this.scrollManager = new ScrollManager();
        this.scrollManager.init();
        this.lenis = this.scrollManager.getLenis();
    }

    initScrollReveal() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
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