class GlobalFooter {
    constructor() {
        this.initFooterWord();
        this.initRevealObserver();
    }

    initFooterWord() {
        const wordEl = document.getElementById('dvFooterWord');
        if (!wordEl) return;
        
        const text = wordEl.textContent.trim();
        if (!text) return;

        wordEl.innerHTML = '';
        text.split('').forEach((ch, i) => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = ch;
            const center = (text.length - 1) / 2;
            const t = center === 0 ? 0 : (i - center) / center;
            const maxArc = window.innerWidth <= 768 ? 16 : 32;
            const yOff = maxArc * t * t;
            const rot = (window.innerWidth <= 768 ? 4 : 7) * t;
            span.style.setProperty('--ax', '0px');
            span.style.setProperty('--ay', yOff.toFixed(1) + 'px');
            span.style.setProperty('--ar', rot.toFixed(1) + 'deg');
            span.style.setProperty('--sd', (0.5 + i * 0.07) + 's');
            wordEl.appendChild(span);
        });
    }

    initRevealObserver() {
        const reveals = document.querySelectorAll('.footer-reveal');
        if (!reveals.length) return;

        if (typeof IntersectionObserver !== 'undefined') {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '150px 0px', threshold: 0.01 });

            reveals.forEach(el => observer.observe(el));
        } else {
            reveals.forEach(el => el.classList.add('in-view'));
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new GlobalFooter());
} else {
    new GlobalFooter();
}
