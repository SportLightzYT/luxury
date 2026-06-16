// DIY SplitText Utility (Detroit.paris style)
class SplitTextDIY {
    constructor(selector) {
        this.elements = document.querySelectorAll(selector);
        this.split();
    }

    split() {
        this.elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            
            // Split by words
            const words = text.split(' ');
            
            words.forEach((word, index) => {
                const parent = document.createElement('span');
                parent.className = 'line-parent';
                parent.style.display = 'inline-block';
                parent.style.overflow = 'hidden';
                parent.style.verticalAlign = 'bottom';
                
                const child = document.createElement('span');
                child.className = 'line-child';
                child.style.display = 'inline-block';
                child.innerText = word + (index < words.length - 1 ? '\u00A0' : ''); 
                
                parent.appendChild(child);
                el.appendChild(parent);
            });
        });
    }

    animate() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        gsap.registerPlugin(ScrollTrigger);
        
        this.elements.forEach(el => {
            const children = el.querySelectorAll('.line-child');
            gsap.fromTo(children, 
                { yPercent: 100 },
                { 
                    yPercent: 0, 
                    duration: 1.2, 
                    ease: "power4.out",
                    stagger: 0.05,
                    scrollTrigger: {
                        trigger: el,
                        start: "top 90%",
                        toggleActions: "play none none none"
                    }
                }
            );
        });
    }
}

window.SplitTextDIY = SplitTextDIY;

window.addEventListener('DOMContentLoaded', () => {
    const headlines = new SplitTextDIY('h1, .talents-headline, .contact-headline, .insights-headline, .services-headline');
    headlines.animate();
});
