/**
 * archive.js
 * Monograph 2026 - Selected Industrial & Brand Works of Suppachok Thepkeaw
 */

(function () {
    'use strict';

    const archiveProjects = [
        {
            id: 'ultraxonic',
            number: '01',
            title: 'UX-1 Ultraxonic',
            subtitle: 'Blind Soccer Shoes with Breaker Thailand',
            category: 'footwear',
            categoryLabel: 'Footwear & Athletic Tech',
            award: 'NCPD 2022 Outstanding Award',
            year: '2022',
            client: 'S.C.S Footwear Co., Ltd. / Breaker Thailand',
            image: 'asset/portfolio_2026/ultraxonic_hero.webp',
            detailImages: [
                'asset/portfolio_2026/ultraxonic_hero.webp',
                'asset/portfolio_2026/ultraxonic_detail.webp',
                'asset/portfolio_2026/ultraxonic_concept.webp',
                'asset/portfolio_2026/ultraxonic_sole.webp',
                'asset/portfolio_2026/ultraxonic_sketch.webp'
            ],
            description: 'Exclusive athletic footwear technology and materials designed for Thailand National Blind Football Athletes. Features echolocation-inspired upper textures that enhance auditory-tactile ball control, specialized protective reinforcement to eliminate foot injuries, and sole plate engineered according to IBSA Football 5-a-side international rules.',
            fullWidth: true
        },
        {
            id: 'kozen',
            number: '02',
            title: 'Kozen Armor',
            subtitle: 'Sneaker Design for Breaker Extreme',
            category: 'footwear',
            categoryLabel: 'Footwear & Lifestyle',
            award: 'Commercial Release 2020',
            year: '2020',
            client: 'Breaker Extreme / S.C.S Footwear',
            image: 'asset/portfolio_2026/kozen_hero.webp',
            detailImages: [
                'asset/portfolio_2026/kozen_hero.webp',
                'asset/portfolio_2026/kozen_detail.webp'
            ],
            description: 'Futuristic lifestyle sneaker inspired by Japanese traditional samurai armor segmentation. Engineered for dynamic mobility, multilayered synthetic overlays, and shock-absorbing midsole architecture.',
            fullWidth: false
        },
        {
            id: 'akabushi',
            number: '03',
            title: 'Akabushi Futsal',
            subtitle: 'Traditional Samurai Footwear Inspired',
            category: 'footwear',
            categoryLabel: 'Footwear & Performance',
            award: 'Best Design Award Winner',
            year: '2020',
            client: 'Breaker Futsal Contest',
            image: 'asset/portfolio_2026/akabushi.webp',
            detailImages: [
                'asset/portfolio_2026/akabushi.webp'
            ],
            description: 'Award-winning futsal shoe marrying samurai warrior footwear aesthetics with high-grip indoor rubber outsoles and precision toe-box striking zones.',
            fullWidth: false
        },
        {
            id: 'orthomedix',
            number: '04',
            title: 'Orthomedix',
            subtitle: 'EVA Foam Orthopedic Sandals',
            category: 'footwear',
            categoryLabel: 'Footwear & Ergonomics',
            award: 'Ergonomic Concept',
            year: '2021',
            client: 'Medical Ergonomics Research',
            image: 'asset/portfolio_2026/orthomedix.webp',
            detailImages: [
                'asset/portfolio_2026/orthomedix.webp'
            ],
            description: 'Turtle carapace-inspired orthopedic recovery sandals. Features an adjustable upper armature that adapts arch support dynamically while transforming aesthetic profiles.',
            fullWidth: false,
            cardThird: true
        },
        {
            id: 'hako',
            number: '05',
            title: 'Hako & Co',
            subtitle: 'Collapsible Eco Kitchenware',
            category: 'product',
            categoryLabel: 'Product & Sustainable Living',
            award: 'Production Ready',
            year: '2021',
            client: 'Hako & Co Brand System',
            image: 'asset/portfolio_2026/hako_hero.webp',
            detailImages: [
                'asset/portfolio_2026/hako_hero.webp',
                'asset/portfolio_2026/hako_colors.webp',
                'asset/portfolio_2026/hako_exploded.webp',
                'asset/portfolio_2026/hako_tray.webp'
            ],
            description: 'Modular collapsible food container and silicone ice tray system designed for modern urban dining. Space-saving food-grade platinum silicone folds into compact geometry with airtight locking lids.',
            fullWidth: false
        },
        {
            id: 'uhoo',
            number: '06',
            title: 'uHoo Sensor',
            subtitle: 'Indoor Air Quality IoT Redesign',
            category: 'product',
            categoryLabel: 'Smart Home & Electronics',
            award: 'Design Exploration',
            year: '2021',
            client: 'uHoo Smart Environment',
            image: 'asset/portfolio_2026/uhoo_render.webp',
            detailImages: [
                'asset/portfolio_2026/uhoo_hero.webp',
                'asset/portfolio_2026/uhoo_render.webp',
                'asset/portfolio_2026/uhoo_exploded.webp'
            ],
            description: 'Redesigned indoor environmental intelligence sensor with refined monolithic cylindrical housing, optimal 360-degree ambient airflow intake, and subtle luminous status halo.',
            fullWidth: false
        },
        {
            id: 'rocking_mellow',
            number: '07',
            title: 'Rocking Mellow',
            subtitle: 'Kinetic Dining Salt & Pepper Shakers',
            category: 'product',
            categoryLabel: 'Industrial & Tableware',
            award: 'BKK Design Week 2021 at ATT19',
            year: '2021',
            client: 'Emerging Plant Showcase',
            image: 'asset/portfolio_2026/rocking_mellow_hero.webp',
            detailImages: [
                'asset/portfolio_2026/rocking_mellow_hero.webp',
                'asset/portfolio_2026/rocking_mellow_detail.webp'
            ],
            description: 'Self-balancing culinary shakers inspired by rocking dolls. The weighted spherical base prevents spills and tipping on the dining table while delivering playful tactile interaction.',
            fullWidth: false
        },
        {
            id: 'another_shelf',
            number: '08',
            title: 'Another Shelf',
            subtitle: 'Minimalist Modular Wall Shelf',
            category: 'furniture',
            categoryLabel: 'Furniture & Living Space',
            award: 'BKK Design Week 2021 at ATT19',
            year: '2021',
            client: 'ATT19 Gallery Exhibition',
            image: 'asset/portfolio_2026/another_shelf.webp',
            detailImages: [
                'asset/portfolio_2026/another_shelf.webp'
            ],
            description: 'Purity in functional minimalism. Sheet-metal bending and concealed mounting create an ultra-slim architectural ledge for curating personal artifacts.',
            fullWidth: false,
            cardThird: true
        },
        {
            id: 'joey',
            number: '09',
            title: 'Joey Dining Chair',
            subtitle: 'Kangaroo Pouch Inspired Seating',
            category: 'furniture',
            categoryLabel: 'Furniture & Craft',
            award: 'Exhibition Design',
            year: '2021',
            client: 'Family Living Collection',
            image: 'asset/portfolio_2026/joey_chair_hero.webp',
            detailImages: [
                'asset/portfolio_2026/joey_chair_hero.webp',
                'asset/portfolio_2026/joey_chair_detail.webp'
            ],
            description: 'Sculptural dining chair embodying the psychological safety of a joey in its mother’s pouch. Warm organic curvature and embracing armrests create intimate comfort during shared family meals.',
            fullWidth: false
        },
        {
            id: 'khaosan',
            number: '10',
            title: 'Khaosan Stool',
            subtitle: 'Transformable Day/Night Street Seating',
            category: 'furniture',
            categoryLabel: 'Urban & Cultural Design',
            award: 'BKK Design Week 2020 at TCDC',
            year: '2020',
            client: 'TCDC Academic Showcase',
            image: 'asset/portfolio_2026/khaosan_stool.webp',
            detailImages: [
                'asset/portfolio_2026/khaosan_stool.webp'
            ],
            description: 'Dual-mode transformable stool capturing the shifting duality of Bangkok’s Khaosan Road—from day market tranquility to vibrant nightlife energy.',
            fullWidth: false,
            cardThird: true
        },
        {
            id: 'in_tung_duce',
            number: '11',
            title: 'In Tung Duce',
            subtitle: 'Lanna Traditional Flag Reimagined',
            category: 'furniture',
            categoryLabel: 'Cultural Heritage & Craft',
            award: 'Chiang Mai Design Week 2018 at TCDC',
            year: '2018',
            client: 'TCDC Chiang Mai Showcase',
            image: 'asset/portfolio_2026/in_tung_duce.webp',
            detailImages: [
                'asset/portfolio_2026/in_tung_duce.webp'
            ],
            description: 'Contemporary spatial reinterpretations of traditional Northern Thai Lanna ceremonial flags (Tung), weaving regional woodcraft with modern geometric textiles.',
            fullWidth: false,
            cardThird: true
        },
        {
            id: 'lunchbloc',
            number: '12',
            title: 'Lunchbloc',
            subtitle: 'New Normal Kindergarten Dining Set',
            category: 'furniture',
            categoryLabel: 'Educational & Public Health',
            award: 'Institutional Design',
            year: '2021',
            client: 'Early Childhood Spatial Research',
            image: 'asset/portfolio_2026/lunchbloc_hero.webp',
            detailImages: [
                'asset/portfolio_2026/lunchbloc_hero.webp',
                'asset/portfolio_2026/lunchbloc_detail.webp'
            ],
            description: 'Ergonomically scaled kindergarten dining suite designed for post-pandemic hygiene standards. Seamless surfaces and modular partitions streamline daily sanitization for school janitors while fostering safe social connection for young children.',
            fullWidth: true
        },
        {
            id: 'nasa_food',
            number: '13',
            title: 'NASA Space Food',
            subtitle: 'Extreme Environment Packaging System',
            category: 'brand',
            categoryLabel: 'Packaging & Future Brand',
            award: 'Concept Packaging Award',
            year: '2021',
            client: 'Aerospace Identity Exploration',
            image: 'asset/portfolio_2026/nasa_space_food_1.webp',
            detailImages: [
                'asset/portfolio_2026/nasa_space_food_1.webp',
                'asset/portfolio_2026/nasa_space_food_2.webp',
                'asset/portfolio_2026/nasa_space_food_3.webp'
            ],
            description: 'Tactile space rations packaging exploring the sensory theme "Feel the Astronaut". High-barrier metallized pouches with utilitarian typographic hierarchy and zero-gravity opening mechanisms.',
            fullWidth: false
        },
        {
            id: 'kollab',
            number: '14',
            title: 'Kollab Identity',
            subtitle: 'Comprehensive Corporate Identity & Brand Book',
            category: 'brand',
            categoryLabel: 'Brand Identity & Strategy',
            award: 'Complete Brand System',
            year: '2021',
            client: 'Kollab Innovation Agency',
            image: 'asset/portfolio_2026/kollab_ci_hero.webp',
            detailImages: [
                'asset/portfolio_2026/kollab_ci_hero.webp',
                'asset/portfolio_2026/kollab_colors.webp',
                'asset/portfolio_2026/kollab_cards.webp',
                'asset/portfolio_2026/kollab_stationery.webp'
            ],
            description: 'Comprehensive corporate visual system featuring a programmatic 4-color chromatic hierarchy (#50DCCD, #3796FA, #8C8CFF, #4D4D4D), corporate stationery, brand guidelines, and spatial signage.',
            fullWidth: false
        },
        {
            id: 'digital_interfaces',
            number: '15',
            title: 'Ergonomate & DOPA',
            subtitle: 'Digital Platforms & Smart City UX',
            category: 'brand',
            categoryLabel: 'Digital Product & Web',
            award: 'Digital Experience',
            year: '2021',
            client: 'Ergonomate / DOPA Smart City',
            image: 'asset/portfolio_2026/ergonomate_web.webp',
            detailImages: [
                'asset/portfolio_2026/ergonomate_web.webp',
                'asset/portfolio_2026/dopa_web.webp'
            ],
            description: 'User experience and modern interface design for Ergonomate Friendly Innovation platform and DOPA Smart City civic services.',
            fullWidth: false
        },
        {
            id: 'meallionair',
            number: '16',
            title: 'Meallionair',
            subtitle: 'Hidden Gems Culinary Identity',
            category: 'brand',
            categoryLabel: 'Brand & Packaging',
            award: 'Brand Identity System',
            year: '2021',
            client: 'Meallionair Hospitality',
            image: 'asset/portfolio_2026/meallionair_hero.webp',
            detailImages: [
                'asset/portfolio_2026/meallionair_hero.webp',
                'asset/portfolio_2026/meallionair_cards.webp'
            ],
            description: 'Sophisticated brand identity for a bespoke culinary collective uncovering Thailand’s hidden gastronomy treasures.',
            fullWidth: false
        }
    ];

    function renderArchiveGrid(filter = 'all') {
        const grid = document.getElementById('archiveGrid');
        if (!grid) return;

        const filtered = filter === 'all'
            ? archiveProjects
            : archiveProjects.filter(p => p.category === filter);

        grid.innerHTML = '';

        filtered.forEach((p, idx) => {
            const card = document.createElement('article');
            let cardClasses = ['archive-card'];
            if (p.fullWidth && filter === 'all') cardClasses.push('full-width');
            else if (p.cardThird && filter === 'all') cardClasses.push('card-third');
            card.className = cardClasses.join(' ');
            card.dataset.projectId = p.id;
            card.tabIndex = 0;

            card.innerHTML = `
                <div class="archive-card-image-wrap">
                    <img src="${p.image}" alt="${p.title}" class="archive-card-image" loading="lazy" decoding="async">
                    <span class="archive-card-tag-pill">${p.categoryLabel}</span>
                    ${p.award ? `<span class="archive-card-award-pill">${p.award}</span>` : ''}
                </div>
                <div class="archive-card-body">
                    <div>
                        <div class="archive-card-header">
                            <h3 class="archive-card-title">${p.title}</h3>
                            <span class="archive-card-num">${p.number}</span>
                        </div>
                        <div class="archive-card-category">${p.subtitle} · ${p.year}</div>
                        <p class="archive-card-desc">${p.description}</p>
                    </div>
                    <div class="archive-card-footer">
                        <span>${p.client}</span>
                        <span class="archive-card-view-link">View Plates</span>
                    </div>
                </div>
            `;

            card.addEventListener('click', () => openProjectModal(p));
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openProjectModal(p);
                }
            });

            grid.appendChild(card);
        });

        // Update counter
        const counter = document.getElementById('archiveCounter');
        if (counter) {
            counter.textContent = `${filtered.length} Projects Displayed`;
        }
    }

    function openProjectModal(project) {
        const modal = document.getElementById('archiveModal');
        const modalBody = document.getElementById('archiveModalBody');
        if (!modal || !modalBody) return;

        modalBody.innerHTML = `
            <div style="margin-bottom: 24px;">
                <span class="archive-header-tag">${project.categoryLabel} · ${project.year}</span>
                <h2 style="font-family: var(--font-display); font-size: clamp(32px, 5vw, 48px); text-transform: uppercase; margin: 8px 0 12px; line-height: 1;">${project.title}</h2>
                <div style="font-size: 14px; font-weight: 600; text-transform: uppercase; color: var(--muted); letter-spacing: 0.08em; margin-bottom: 16px;">
                    ${project.subtitle} · Client: ${project.client}
                </div>
                ${project.award ? `<div class="accolade-badge gold" style="margin-bottom: 18px;">★ ${project.award}</div>` : ''}
                <p style="font-size: 16px; line-height: 1.7; color: rgba(5,5,5,0.85); max-width: 800px;">${project.description}</p>
            </div>
            <div class="archive-modal-gallery">
                ${project.detailImages.map((imgSrc, i) => `
                    <div style="background: #f0f0ee;">
                        <img src="${imgSrc}" alt="${project.title} - Plate ${i + 1}" class="archive-modal-img" loading="lazy" decoding="async">
                        <div style="padding: 10px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); border-top: 1px solid rgba(5,5,5,0.06);">Plate ${String(i + 1).padStart(2, '0')} · Design Sheet</div>
                    </div>
                `).join('')}
            </div>
        `;

        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const modal = document.getElementById('archiveModal');
        if (!modal) return;
        modal.classList.remove('is-open');
        document.body.style.overflow = '';
    }

    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                renderArchiveGrid(filter);
                if (window.ScrollUtils) {
                    window.ScrollUtils.measure();
                    window.ScrollUtils.requestRender();
                }
            });
        });
    }

    function initModalEvents() {
        const modal = document.getElementById('archiveModal');
        const closeBtn = document.getElementById('archiveModalClose');
        if (!modal) return;

        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('is-open')) {
                closeModal();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        renderArchiveGrid('all');
        initFilters();
        initModalEvents();
    });

})();
