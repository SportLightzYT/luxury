class CustomCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.pointerEvents = 'none';
        document.body.appendChild(this.cursor);
        
        this.clientX = -100;
        this.clientY = -100;
        this.cursorX = -100;
        this.cursorY = -100;
        
        this.isHovering = false;
        
        this.init();
    }
    
    init() {
        // Track mouse movement
        document.addEventListener('mousemove', (e) => {
            this.clientX = e.clientX;
            this.clientY = e.clientY;
        });
        
        // Track hover elements
        const hoverSelectors = 'a, button, .gallery-item, .dv-close, .dv-action-link, .nav-link, .nav-logo';
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(hoverSelectors)) {
                this.cursor.classList.add('hover');
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(hoverSelectors)) {
                this.cursor.classList.remove('hover');
            }
        });
        
        // Render loop for smooth trailing
        const render = () => {
            // Easing factor (lower is smoother/slower)
            this.cursorX += (this.clientX - this.cursorX) * 0.15;
            this.cursorY += (this.clientY - this.cursorY) * 0.15;
            
            this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`;
            
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // Only enable custom cursor on non-touch devices
    if (window.matchMedia("(pointer: fine)").matches) {
        new CustomCursor();
    }
});
