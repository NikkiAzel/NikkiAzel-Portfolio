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
            
            const words = text.split(' ');
            let globalCharIndex = 0; 
            
            words.forEach((word, index) => {
                const wordWrapper = document.createElement('span');
                wordWrapper.style.display = 'inline-block';
                wordWrapper.style.whiteSpace = 'nowrap';
                
                for (let char of word) {
                    const span = document.createElement('span');
                    span.textContent = char;
                    span.className = 'glow-letter';
                    span.style.animationDelay = `${globalCharIndex * 0.08}s`;
                    wordWrapper.appendChild(span);
                    globalCharIndex++;
                }
                
                heroName.appendChild(wordWrapper);
                if (index < words.length - 1) {
                    heroName.appendChild(document.createTextNode(' '));
                    globalCharIndex++; 
                }
            });
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
    // 2. DASHBOARD BACKGROUND PRELOADER
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
            'before-after': { count: 27, path: 'assets/photos/comparison/after-' }, 
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
    // 3. PHOTOS PAGE SLIDERS & COMPARISON ENGINE
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

        document.querySelectorAll('.slider-wrapper:not(.fluid-comparison)').forEach(wrapper => {
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
                    const networkImage = new Image();
                    networkImage.onload = () => {
                        imgEl.src = networkImage.src;
                        imgEl.style.opacity = 1;
                        isAnimating = false; 
                        preloadNeighbors(currentIndex);
                    };
                    networkImage.src = imgList[currentIndex];
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

        // --- Before & After Engine Logic ---
        const baSlider = document.getElementById('comparison-slider');
        const afterContainer = document.getElementById('after-container');
        const comparisonLine = document.getElementById('comparison-line');
        const beforeImg = document.getElementById('before-img');
        const afterImg = document.getElementById('after-img');

        if (baSlider && afterContainer && comparisonLine) {
            let baIndex = 1;
            const baCount = 27; 

            const moveSlider = (val) => {
                afterContainer.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
                comparisonLine.style.left = `${val}%`;
            };

            baSlider.addEventListener('input', (e) => moveSlider(e.target.value));

            // V4: Mobile Screen Lock Implementation
            baSlider.addEventListener('touchmove', (e) => {
                // THE LOCK: This line physically freezes the screen's scrolling engine while dragging
                e.preventDefault(); 
                
                const rect = baSlider.getBoundingClientRect();
                const touchX = e.touches[0].clientX - rect.left;
                const percentage = (touchX / rect.width) * 100;
                
                const constrainedVal = Math.max(0, Math.min(100, percentage));
                
                baSlider.value = constrainedVal;
                moveSlider(constrainedVal);
            }, { passive: false }); // passive must be false to allow the lock to work

            const updateComparisonPair = () => {
                beforeImg.src = `assets/photos/comparison/before-${baIndex}.jpg`;
                afterImg.src = `assets/photos/comparison/after-${baIndex}.jpg`;
                baSlider.value = 50; 
                moveSlider(50);
            };

            document.getElementById('ba-next').addEventListener('click', () => {
                baIndex = baIndex < baCount ? baIndex + 1 : 1;
                updateComparisonPair();
            });
            document.getElementById('ba-prev').addEventListener('click', () => {
                baIndex = baIndex > 1 ? baIndex - 1 : baCount;
                updateComparisonPair();
            });
        }
    }

    // ==========================================
    // 4. MULTIMEDIA GALLERIES (.page-multimedia)
    // ==========================================
    if (document.body.classList.contains('page-multimedia')) {
        
        // 1. YOUR CUSTOM NAMES LIST (30 Unique Names)
        const studioProjectNames = [
            "Mastermind | 2017",
            "Venom of Fear | 2017",
            "Shut-gun | 2017",
            "Ouroboros | 2016",
            "Jormungand | 2016",
            "Moon Eater | 2016",
            "Hydralisk | 2020",
            "Ages of Time | 2017",
            "Silence | 2016",
            "Castle | 2015",
            "Knight of Stone | 2015",
            "Halberd Knight | 2024",
            "Chest of Insight | 2015",
            "Durc the Orc | 2015",
            "Executioner Mask | 2015",
            "Gas Mask | 2014",
            "Steampunk hat | 2014",
            "Fruit | 2014",
            "Beauty of Flowers | 2014",
            "Nature's Call | 2014",
            "Tuji Bunny | 2025",
            "Shooky | 2026",
            "Tata | 2025",
            "Cooky | 2025",
            "Chimmy | 2025",
            "Hornet | 2025",
            "Mudrock | 2025",
            "Koya | 2025",
            "Dodoco | 2025",
            "Mang | 2025"
        ];

        const galleryConfigs = [
            { id: 'studio-gallery', count: 30, path: 'assets/photos/studio/s-', names: studioProjectNames },
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

                // --- CINEMATIC TEXT OVERLAY: Only applies to Studio ---
                if (config.id === 'studio-gallery') {
                    const overlay = document.createElement('div');
                    overlay.className = 'studio-overlay';
                    
                    const name = document.createElement('span');
                    name.className = 'gallery-image-name';
                    
                    // Assign name from array or fallback
                    if (config.names && config.names[i - 1]) {
                        name.textContent = config.names[i - 1];
                    } else {
                        name.textContent = `Studio Artwork ${i}`; 
                    }
                    
                    overlay.appendChild(name);
                    item.appendChild(overlay);
                }
                // ------------------------------------------------

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
    // 6. ABOUT PAGE LOGIC & CINEMATIC OBSERVERS
    // ==========================================
    if (document.body.classList.contains('page-about')) {
        
        const cinematicObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    if(entry.target.classList.contains('about-hero-logo')) entry.target.classList.add('focus-active');
                    if(entry.target.classList.contains('about-headline')) entry.target.classList.add('focus-active');
                    cinematicObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        const aboutLogo = document.querySelector('.about-hero-logo');
        const aboutHead = document.querySelector('.about-headline');
        if(aboutLogo) cinematicObserver.observe(aboutLogo);
        if(aboutHead) cinematicObserver.observe(aboutHead);

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
    
    let dashboardSection = null;
    if (document.body.classList.contains('page-photos')) {
        dashboardSection = document.getElementById('categories');
    } else if (document.body.classList.contains('page-multimedia')) {
        dashboardSection = document.getElementById('multimedia-dash');
    }

    if (floatingNav && dashboardSection) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingNav.classList.remove('visible');
                } else {
                    floatingNav.classList.add('visible');
                }
            });
        }, { threshold: 0.1 }); 

        navObserver.observe(dashboardSection);
    }
    
    // ==========================================
    // 8. MOBILE SCROLL-SNAP ANCHOR FIX
    // ==========================================
    const snapContainer = document.querySelector('.snap-container');
    
    if (snapContainer) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    e.preventDefault(); 
                    
                    const containerTop = snapContainer.getBoundingClientRect().top;
                    const targetTop = targetElement.getBoundingClientRect().top;
                    const exactScrollPosition = snapContainer.scrollTop + (targetTop - containerTop);
                    
                    snapContainer.scrollTo({
                        top: exactScrollPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
});