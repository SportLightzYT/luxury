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
            const yOff = 32 * t * t;
            const rot = 7 * t;
            span.style.setProperty('--ax', '0px');
            span.style.setProperty('--ay', yOff.toFixed(1) + 'px');
            span.style.setProperty('--ar', rot.toFixed(1) + 'deg');
            span.style.setProperty('--sd', (0.5 + i * 0.07) + 's');
            wordEl.appendChild(span);
        });
    }

    initRevealObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.footer-reveal').forEach(el => observer.observe(el));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new GlobalFooter();
});
