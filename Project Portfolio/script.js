document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. HOME PAGE LOGIC (.page-home)
    // ==========================================
    if (document.body.classList.contains('page-home')) {
        document.body.classList.add('home-bg-glow');
        document.addEventListener('mousemove', (e) => {
            document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
        });

        // Split Hero Name for Glow Effect
        const heroName = document.querySelector('.hero-name');
        if (heroName) {
            const text = heroName.textContent;
            heroName.innerHTML = ''; 
            for (let char of text) {
                if (char === ' ') {
                    heroName.appendChild(document.createTextNode(' '));
                } else {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'glow-letter';
                    heroName.appendChild(span);
                }
            }
        }

        // Magnet Logo
        const magnet = document.querySelector('.magnet-logo');
        if (magnet && window.innerWidth > 768) {
            magnet.addEventListener('mousemove', (e) => {
                const rect = magnet.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
                magnet.style.transform = `translate(${x}px, ${y}px)`;
            });
            magnet.addEventListener('mouseleave', () => {
                magnet.style.transform = 'translate(0, 0)';
            });
        }
    }

    // ==========================================
    // 2. DASHBOARD BACKGROUND HOVER (Photos & Multimedia)
    // ==========================================
    const bgOverlay = document.getElementById('bg-overlay-dash');
    const vignette = document.querySelector('.vignette');
    const catItems = document.querySelectorAll('.cat-item');

    if (bgOverlay && catItems.length > 0) {
        const defaultBg = 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600';
        bgOverlay.style.backgroundImage = `url('${defaultBg}')`;
        bgOverlay.style.backgroundPosition = "center center";
        bgOverlay.style.opacity = '0.0'; 
        if (vignette) vignette.style.opacity = '0.8';

        // Add dynamic title if on photos page
        const categoryGrid = document.querySelector('.category-grid');
        if (document.body.classList.contains('page-photos') && categoryGrid && !document.querySelector('.select-cat-title')) {
            const titleContainer = document.createElement('div');
            titleContainer.className = 'select-cat-title';
            titleContainer.style.gridColumn = '1 / -1';
            titleContainer.style.textAlign = 'center';
            titleContainer.style.marginBottom = '2rem';
            
            const titleText = document.createElement('h2');
            titleText.textContent = 'PHOTO CATEGORIES';
            titleText.style.fontFamily = "'Montserrat', sans-serif";
            titleText.style.fontWeight = '100';
            titleText.style.letterSpacing = '10px';
            titleText.style.fontSize = '2rem';
            titleText.style.color = '#fff';
            
            titleContainer.appendChild(titleText);
            categoryGrid.insertBefore(titleContainer, categoryGrid.firstChild);
        }

        const tracker = {}; 

        catItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const cat = item.getAttribute('data-category');
                let imgUrl = "";
                let count = 0;
                let path = "";

                if (cat === 'real-estate') { count = 40; path = 'assets/photos/real-estate/re-'; }
                else if (cat === 'automotive') { count = 67; path = 'assets/photos/auto/a-'; }
                else if (cat === 'wedding') { count = 21; path = 'assets/photos/wedding/w-'; }
                else if (cat === 'food') { count = 187; path = 'assets/photos/food/f-'; }
                else if (cat === 'profile') { count = 20; path = 'assets/photos/profile/p-'; }
                else if (cat === 'product') { count = 18; path = 'assets/photos/product/pr-'; }
                else if (cat === 'studio') { count = 30; path = 'assets/photos/studio/s-'; }
                else if (cat === 'graphic') { count = 23; path = 'assets/photos/graphic/g-'; }
                else if (cat === 'video') { count = 3; path = 'assets/photos/video/v-'; }

                if (count > 0) {
                    let randomNum = Math.floor(Math.random() * count) + 1;
                    if (count > 1) {
                        while (randomNum === tracker[cat]) {
                            randomNum = Math.floor(Math.random() * count) + 1;
                        }
                    }
                    tracker[cat] = randomNum;
                    imgUrl = `${path}${randomNum}.jpg`;
                }

                if (imgUrl) {
                    bgOverlay.style.backgroundImage = `url('${imgUrl}')`;
                    bgOverlay.style.backgroundPosition = (cat === 'profile') ? "center 35%" : "center center";
                    bgOverlay.style.opacity = '1'; 
                    if(vignette) vignette.style.opacity = '1';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                bgOverlay.style.backgroundImage = `url('${defaultBg}')`;
                bgOverlay.style.backgroundPosition = "center center";
                bgOverlay.style.opacity = '0.0';
                if (!document.body.classList.contains('page-multimedia')) {
                    if(vignette) vignette.style.opacity = '0.0';
                }
            });
        });
    }

    // ==========================================
    // 3. PHOTOS PAGE SLIDERS (.page-photos)
    // ==========================================
    if (document.body.classList.contains('page-photos')) {
        const categoryImages = {
            'real-estate': Array.from({ length: 40 }, (_, i) => `assets/photos/real-estate/re-${i + 1}.jpg`),
            'automotive': Array.from({ length: 67 }, (_, i) => `assets/photos/auto/a-${i + 1}.jpg`),
            'wedding': Array.from({ length: 21 }, (_, i) => `assets/photos/wedding/w-${i + 1}.jpg`),
            'food': Array.from({ length: 187 }, (_, i) => `assets/photos/food/f-${i + 1}.jpg`),
            'profile': Array.from({ length: 20 }, (_, i) => `assets/photos/profile/p-${i + 1}.jpg`),
            'product': Array.from({ length: 18 }, (_, i) => `assets/photos/product/pr-${i + 1}.jpg`),
        };

        document.querySelectorAll('.slider-wrapper').forEach(wrapper => {
            const imgEl = wrapper.querySelector('.slider-img');
            const cat = imgEl.getAttribute('data-category');
            const imgList = categoryImages[cat];
            if (!imgList || imgList.length === 0) return;

            let currentIndex = Math.floor(Math.random() * imgList.length);
            let isAnimating = false; 
            let slideTimer; 
            
            imgEl.src = imgList[currentIndex];

            const changeSlide = (direction) => {
                if (isAnimating) return; 
                isAnimating = true;

                if (direction === 'random') {
                    let newIndex = currentIndex;
                    while (newIndex === currentIndex && imgList.length > 1) {
                        newIndex = Math.floor(Math.random() * imgList.length);
                    }
                    currentIndex = newIndex;
                } else if (direction === 'next') {
                    currentIndex = (currentIndex + 1) % imgList.length;
                } else {
                    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
                }
                
                imgEl.style.opacity = 0;
                setTimeout(() => {
                    imgEl.src = imgList[currentIndex];
                    imgEl.style.opacity = 1;
                    isAnimating = false; 
                }, 600);
            };

            const resetAutoSlide = () => {
                clearInterval(slideTimer); 
                slideTimer = setInterval(() => changeSlide('random'), 5000); 
            };

            wrapper.querySelector('.btn-next').addEventListener('click', () => { changeSlide('next'); resetAutoSlide(); });
            wrapper.querySelector('.btn-prev').addEventListener('click', () => { changeSlide('prev'); resetAutoSlide(); });

            slideTimer = setInterval(() => changeSlide('random'), 5000);
        });
    }

    // ==========================================
    // 4. MULTIMEDIA GALLERIES (.page-multimedia)
    // ==========================================
    if (document.body.classList.contains('page-multimedia')) {
        const galleryConfigs = [
            { id: 'studio-gallery', count: 30, path: 'assets/photos/studio/s-' },
            { id: 'graphic-gallery', count: 23, path: 'assets/photos/graphic/g-' }
        ];

        function generateGallery(config) {
            const container = document.getElementById(config.id);
            if (!container) return;
            
            const fragment = document.createDocumentFragment();
            
            for (let i = 1; i <= config.count; i++) {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = `${config.path}${i}.jpg`; 
                img.alt = `Art ${i}`;
                img.loading = "lazy"; 
                
                item.appendChild(img);
                fragment.appendChild(item);
            }
            container.appendChild(fragment);
        }

        galleryConfigs.forEach(config => generateGallery(config));
    }

    // ==========================================
    // 5. GLOBAL LOGIC (Observers & Lightbox)
    // ==========================================
    
    // Headline Pop-up Observation
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('reveal-active'); } 
            else { entry.target.classList.remove('reveal-active'); }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.reveal-text').forEach(text => revealObserver.observe(text));

    // Global Lightbox
    const lightbox = document.getElementById('gallery-lightbox');
    if (lightbox) {
        const lbImg = lightbox.querySelector('.lightbox-img');
        
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.closest('.gallery-item')) {
                lbImg.src = e.target.src;
                lightbox.classList.add('lightbox-active');
            }
        });
        lightbox.addEventListener('click', () => lightbox.classList.remove('lightbox-active'));
    }
});