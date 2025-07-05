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

    // Make follower grow when hovering interactive elements
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
            // scrolling down
            nav.style.top = "-100px";
        } else {
            // scrolling up
            nav.style.top = "0";
        }
        
        lastScrollTop = scrollTop;
    });

    // =============================================
    // Scroll Animations for Sections (REPEATING)
    // =============================================
    const aboutSection = document.querySelector('.about-me-section');
    const header = document.querySelector('.fullscreen-header');
    const heroImg = document.querySelector('.hero-section .right img');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const workItems = document.querySelectorAll('.work-item');

    // Configure Intersection Observer for repeating animations
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When element enters viewport
                if (entry.target.classList.contains('about-me-section')) {
                    entry.target.classList.add('visible');
                    document.body.classList.add('scrolled-past-hero');
                    
                    // Add temporary animation class
                    entry.target.classList.add('animating');
                    setTimeout(() => {
                        entry.target.classList.remove('animating');
                    }, 1000);
                }
                
                if (entry.target.classList.contains('work-item')) {
                    entry.target.classList.add('is-visible');
                }
            } else {
                // When element leaves viewport
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

    // Observe all animated sections
    animationObserver.observe(aboutSection);
    workItems.forEach((item, index) => {
        // Add staggered delay only when entering viewport
        item.addEventListener('animationstart', () => {
            item.style.transitionDelay = `${index * 0.1}s`;
        }, { once: true });
        
        animationObserver.observe(item);
    });

    // Remove scroll indicator after first scroll
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
    // Initialize Carousels (if any)
    // =============================================
    // Your carousel initialization code would go here
});

//--------------------------------------------------------

// Enhanced theme toggle with localStorage
const toggleBtn = document.getElementById("toggleTheme");

function setTheme(isDark) {
    if (isDark) {
        document.body.classList.add("dark-mode");
        document.body.classList.remove("light-mode");
        document.documentElement.style.setProperty('--current-bg', 'var(--dark-bg)');
    } else {
        document.body.classList.add("light-mode");
        document.body.classList.remove("dark-mode");
        document.documentElement.style.setProperty('--current-bg', 'var(--light-beige)');
    }
}

// Initialize theme - add this to check system preference if no localStorage
if (localStorage.getItem("darkMode") === null) {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark);
}
toggleBtn.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark-mode");
    setTheme(isDark);
    localStorage.setItem("darkMode", isDark);
});

// Initialize theme
const savedTheme = localStorage.getItem("darkMode");
setTheme(savedTheme === "true");


//----------------------------------------------------
//Caroussel

document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.getElementById('verticalCarousel');
  const dotsContainer = document.getElementById('carouselDots');
  const slides = carousel.querySelectorAll('.carousel-slide');
  const slideCount = slides.length;
  let currentSlide = 0;
  let isDragging = false;
  let startY = 0;
  let currentY = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  // Create navigation dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  // Initialize carousel position
  updateCarousel();

  // Touch events
  carousel.addEventListener('touchstart', touchStart);
  carousel.addEventListener('touchend', touchEnd);
  carousel.addEventListener('touchmove', touchMove);

  // Mouse events
  carousel.addEventListener('mousedown', dragStart);
  carousel.addEventListener('mouseup', dragEnd);
  carousel.addEventListener('mouseleave', dragEnd);
  carousel.addEventListener('mousemove', drag);

  function updateCarousel() {
    carousel.style.transform = `translateY(-${currentSlide * 100}%)`;
    
    // Update active dot
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentSlide);
    });
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function dragStart(e) {
    e.preventDefault();
    isDragging = true;
    startY = e.clientY;
    carousel.style.transition = 'none';
  }

  function touchStart(e) {
    isDragging = true;
    startY = e.touches[0].clientY;
    carousel.style.transition = 'none';
  }

  function drag(e) {
    if (!isDragging) return;
    e.preventDefault();
    currentY = e.clientY;
    const diff = currentY - startY;
    carousel.style.transform = `translateY(calc(-${currentSlide * 100}% + ${diff}px))`;
  }

  function touchMove(e) {
    if (!isDragging) return;
    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    carousel.style.transform = `translateY(calc(-${currentSlide * 100}% + ${diff}px))`;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
    
    const movedBy = currentY - startY;
    
    if (movedBy < -50 && currentSlide < slideCount - 1) {
      currentSlide++;
    } else if (movedBy > 50 && currentSlide > 0) {
      currentSlide--;
    }
    
    updateCarousel();
  }

  function touchEnd() {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.transition = 'transform 0.5s cubic-bezier(0.33, 1, 0.68, 1)';
    
    const movedBy = currentY - startY;
    
    if (movedBy < -50 && currentSlide < slideCount - 1) {
      currentSlide++;
    } else if (movedBy > 50 && currentSlide > 0) {
      currentSlide--;
    }
    
    updateCarousel();
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentSlide < slideCount - 1) {
      currentSlide++;
      updateCarousel();
    } else if (e.key === 'ArrowUp' && currentSlide > 0) {
      currentSlide--;
      updateCarousel();
    }
  });
});