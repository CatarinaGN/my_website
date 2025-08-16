document.addEventListener('DOMContentLoaded', function() {
    // =============================================
    // Mouse Follower Effect
    // =============================================
    const follower = document.createElement('div');
    follower.classList.add('mouse-follower');
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
        follower.style.left = `${e.clientX}px`;
        follower.style.top = `${e.clientY}px`;
    });

    const interactiveElements = document.querySelectorAll('a, button, .hello-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('active');
        });
    });

    // =============================================
    // Navigation Hide/Show on Scroll
    // =============================================
    let lastScrollTop = 0;
    const nav = document.getElementById("mainNav");

    window.addEventListener("scroll", function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            nav.style.top = "-100px";
        } else {
            nav.style.top = "0";
        }
        lastScrollTop = scrollTop;
    });

    // =============================================
    // Scroll Animations for Sections (REPEATING)
    // =============================================
    const aboutSection = document.querySelector('.about-me-section');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const workItems = document.querySelectorAll('.work-item');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-me-section')) {
                    entry.target.classList.add('visible');
                    document.body.classList.add('scrolled-past-hero');
                    entry.target.classList.add('animating');
                    setTimeout(() => {
                        entry.target.classList.remove('animating');
                    }, 1000);
                }
                if (entry.target.classList.contains('work-item')) {
                    entry.target.classList.add('is-visible');
                }
            } else {
                if (entry.target.classList.contains('about-me-section')) {
                    entry.target.classList.remove('visible');
                    document.body.classList.remove('scrolled-past-hero');
                }
                if (entry.target.classList.contains('work-item')) {
                    entry.target.classList.remove('is-visible');
                }
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    });

    animationObserver.observe(aboutSection);
    workItems.forEach((item, index) => {
        item.addEventListener('animationstart', () => {
            item.style.transitionDelay = `${index * 0.1}s`;
        }, { once: true });
        animationObserver.observe(item);
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50 && scrollIndicator) {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => {
                if (scrollIndicator.parentNode) {
                    scrollIndicator.parentNode.removeChild(scrollIndicator);
                }
            }, 300);
        }
    }, { once: true });

    // =============================================
    // Smooth Scroll for Anchor Links
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // Initialize Work Carousels
    // =============================================
    document.querySelectorAll('.work-carousel').forEach((carousel) => {
        const track = carousel.querySelector('.vertical-carousel');
        const slides = Array.from(track.querySelectorAll('.carousel-slide'));
        const dotsContainer = carousel.querySelector('.carousel-dots');

        if (!track || slides.length === 0 || !dotsContainer) return;

        let current = 0;
        let isDragging = false;
        let startY = 0;
        let currentY = 0;
        let prevTranslate = 0;
        let currentTranslate = 0;
        let startTime = 0;
        let autoplayId = null;

        const AUTOPLAY_DELAY = 5000; // 5s per slide
        const SWIPE_THRESHOLD = 50; // px
        const VELOCITY_THRESHOLD = 0.4; // px/ms for momentum swipe

        // Build dots
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'carousel-dot';
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => { goTo(i); restartAutoplay(); });
            dotsContainer.appendChild(dot);
        });
        if (slides.length <= 1) dotsContainer.style.display = 'none';

        function updateDots() {
            [...dotsContainer.children].forEach((dot, i) =>
                dot.classList.toggle('active', i === current)
            );
        }

        function setTranslate(y, withTransition = false) {
            track.style.transition = withTransition ? 'transform 500ms cubic-bezier(0.33,1,0.68,1)' : 'none';
            track.style.transform = `translateY(${y}px)`;
        }

        function goTo(i) {
            const count = slides.length;
            current = ((i % count) + count) % count; // wrap-around
            prevTranslate = -current * track.clientHeight;
            setTranslate(prevTranslate, true);
            updateDots();
        }

        function onStart(e) {
            if (slides.length <= 1) return;
            isDragging = true;
            startY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
            currentY = startY;
            prevTranslate = -current * track.clientHeight;
            startTime = Date.now();
            clearInterval(autoplayId);
            track.style.transition = 'none';

            // For mouse, prevent text/image selection
            if (!('touches' in e)) e.preventDefault();
        }

        function onMove(e) {
            if (!isDragging) return;
            currentY = ('touches' in e) ? e.touches[0].clientY : e.clientY;
            const diff = currentY - startY;
            currentTranslate = prevTranslate + diff;
            setTranslate(currentTranslate, false);
            if ('touches' in e) e.preventDefault();
        }

        function onEnd() {
            if (!isDragging) return;
            isDragging = false;

            const movedBy = currentY - startY;
            const elapsed = Date.now() - startTime;
            const velocity = movedBy / elapsed; // px/ms

            if (velocity < -VELOCITY_THRESHOLD || movedBy < -SWIPE_THRESHOLD) {
                current++;
            } else if (velocity > VELOCITY_THRESHOLD || movedBy > SWIPE_THRESHOLD) {
                current--;
            }

            goTo(current);
            restartAutoplay();
        }

        // Mouse events
        track.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        // Touch events
        track.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);

        function startAutoplay() {
            clearInterval(autoplayId);
            if (slides.length <= 1) return;
            autoplayId = setInterval(() => goTo(current + 1), AUTOPLAY_DELAY);
        }

        function restartAutoplay() {
            clearInterval(autoplayId);
            startAutoplay();
        }

        carousel.addEventListener('mouseenter', () => clearInterval(autoplayId));
        carousel.addEventListener('mouseleave', startAutoplay);

        goTo(0);
        startAutoplay();
    });

});