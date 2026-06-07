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
    // 2. DASHBOARD BACKGROUND "LOOKAHEAD PRELOADER" 
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

        const preloadedBgUrls = {};
        const catData = {
            'real-estate': { count: 40, path: 'assets/photos/real-estate/re-' },
            'automotive': { count: 67, path: 'assets/photos/auto/a-' },
            'wedding': { count: 21, path: 'assets/photos/wedding/w-' },
            'food': { count: 187, path: 'assets/photos/food/f-' },
            'profile': { count: 20, path: 'assets/photos/profile/p-' },
            'product': { count: 18, path: 'assets/photos/product/pr-' },
            'studio': { count: 30, path: 'assets/photos/studio/s-' },
            'graphic': { count: 23, path: 'assets/photos/graphic/g-' },
            'video': { count: 3, path: 'assets/photos/video/v-' }
        };

        const prepNextBackground = (cat) => {
            if (!catData[cat]) return;
            const data = catData[cat];
            let randomNum = Math.floor(Math.random() * data.count) + 1;
            let imgUrl = `${data.path}${randomNum}.jpg`;
            preloadedBgUrls[cat] = imgUrl;
            
            const img = new Image();
            img.src = imgUrl;
        };

        catItems.forEach(item => prepNextBackground(item.getAttribute('data-category')));

        catItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const cat = item.getAttribute('data-category');
                const imgUrl = preloadedBgUrls[cat]; 

                if (imgUrl) {
                    bgOverlay.style.backgroundImage = `url('${imgUrl}')`;
                    bgOverlay.style.backgroundPosition = (cat === 'profile') ? "center 35%" : "center center";
                    bgOverlay.style.opacity = '1'; 
                    if(vignette) vignette.style.opacity = '1';
                }
                
                prepNextBackground(cat);
            });
            
            item.addEventListener('mouseleave', () => {
                bgOverlay.style.backgroundImage = 'none';
                bgOverlay.style.opacity = '0.0';
                if (!document.body.classList.contains('page-multimedia')) {
                    if(vignette) vignette.style.opacity = '0.0';
                }
            });
        });
    }

    // ==========================================
    // 3. PHOTOS PAGE "NEIGHBOR PRELOADER" SLIDERS
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

            const preloadNeighbors = (index) => {
                const nextIdx = (index + 1) % imgList.length;
                const prevIdx = (index - 1 + imgList.length) % imgList.length;
                const nextImg = new Image(); nextImg.src = imgList[nextIdx];
                const prevImg = new Image(); prevImg.src = imgList[prevIdx];
            };
            preloadNeighbors(currentIndex);

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
                    preloadNeighbors(currentIndex);
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
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { entry.target.classList.add('reveal-active'); } 
            else { entry.target.classList.remove('reveal-active'); }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.reveal-text').forEach(text => revealObserver.observe(text));

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

    // ==========================================
    // 6. ABOUT PAGE SKILLS ANIMATION
    // ==========================================
    if (document.body.classList.contains('page-about')) {
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const percent = parseInt(el.getAttribute('data-percent'));
                    const color = el.getAttribute('data-color');
                    let count = 0;
                    
                    const interval = setInterval(() => {
                        count++;
                        el.style.background = `conic-gradient(#222 ${100 - count}%, ${color} ${100 - count}%)`;
                        el.querySelector('.percent-text').textContent = count + '%';
                        if (count >= percent) clearInterval(interval);
                    }, 10);
                    
                    skillObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.skill-circle').forEach(circle => skillObserver.observe(circle));

        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const row = entry.target;
                    const fill = row.querySelector('.bar-skill-fill');
                    const pctText = row.querySelector('.bar-skill-percent');
                    const percent = parseInt(row.getAttribute('data-percent'));
                    
                    pctText.classList.add('show-percent');
                    setTimeout(() => { fill.style.width = percent + '%'; }, 100);
                    
                    let count = 0;
                    const stepTime = 1500 / percent; 
                    
                    const interval = setInterval(() => {
                        count++;
                        pctText.textContent = count + '%';
                        if (count >= percent) clearInterval(interval);
                    }, stepTime);
                    
                    barObserver.unobserve(row);
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('.bar-skill-row').forEach(row => barObserver.observe(row));
    }

    // ==========================================
    // 7. FLOATING NAVIGATION BAR LOGIC
    // ==========================================
    const floatingNav = document.getElementById('floating-nav');
    
    // Automatically detect which dashboard section to watch
    let dashboardSection = null;
    if (document.body.classList.contains('page-photos')) {
        dashboardSection = document.getElementById('categories');
    } else if (document.body.classList.contains('page-multimedia')) {
        dashboardSection = document.getElementById('multimedia-dash');
    }

    if (floatingNav && dashboardSection) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If the dashboard is visible, hide the floating nav
                if (entry.isIntersecting) {
                    floatingNav.classList.remove('visible');
                } else {
                    // Once you scroll past the dashboard, slide the nav up!
                    floatingNav.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }); // Triggers when the dashboard is almost out of view

        navObserver.observe(dashboardSection);
    }
});