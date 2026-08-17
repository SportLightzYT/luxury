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
        this.clockInterval = setInterval(updateClocks, 60000);
        window.addEventListener('pagehide', () => clearInterval(this.clockInterval));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('page-loaded');
    const ctrl = new ContactController();
    ctrl.init();
});