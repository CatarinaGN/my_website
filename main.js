// Mouse follower effect
document.addEventListener('DOMContentLoaded', () => {
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

    // Scroll animation for about section
    const aboutSection = document.querySelector('.about-me-section');
    
    function checkScroll() {
        const sectionTop = aboutSection.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            aboutSection.classList.add('animate');
        }
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Run once on load
});


// Navigation hide/show on scroll
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


//-----------------------------------------------------------------
// Scroll animation for about section
document.addEventListener('DOMContentLoaded', function() {
    const aboutSection = document.querySelector('.about-me-section');
    const header = document.querySelector('.fullscreen-header');
    const heroImg = document.querySelector('.hero-section .right img');
    
    // More precise intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutSection.classList.add('visible');
                document.body.classList.add('scrolled-past-hero');
                
                // Add a temporary class for the initial animation
                aboutSection.classList.add('animating');
                setTimeout(() => {
                    aboutSection.classList.remove('animating');
                }, 1000);
            } else {
                document.body.classList.remove('scrolled-past-hero');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    observer.observe(aboutSection);
    
    // Remove scroll indicator after first scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            scrollIndicator.style.opacity = '0';
            setTimeout(() => scrollIndicator.remove(), 300);
        }
    }, { once: true });
    
    // Add smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
//-----------------------------------------------------------------

//Caroussel

document.addEventListener('DOMContentLoaded', function() {
    // Carousel elements
    const mainImage = document.getElementById('mainCarouselImage');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageCounter = document.getElementById('imageCounter');
    
    // Image paths - adjust according to your actual files
    const imagePaths = [];
    for (let i = 1; i <= 9; i++) {
        imagePaths.push(`images/case-1=Variant${i}.png`);
    }
    
    let currentIndex = 0;

    // Update carousel display
    function updateCarousel() {
        // Update main image
        mainImage.src = imagePaths[currentIndex];
        mainImage.alt = `Project image ${currentIndex + 1}`;
        
        // Update counter
        imageCounter.textContent = `${currentIndex + 1}/${imagePaths.length}`;
        
        // Update active thumbnail
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.remove('active');
            if (index === currentIndex) thumb.classList.add('active');
        });
    }
    
    // Navigation functions
    function showNextImage() {
        currentIndex = (currentIndex + 1) % imagePaths.length;
        updateCarousel();
    }
    
    function showPrevImage() {
        currentIndex = (currentIndex - 1 + imagePaths.length) % imagePaths.length;
        updateCarousel();
    }
    
    // Event listeners
    nextBtn.addEventListener('click', showNextImage);
    prevBtn.addEventListener('click', showPrevImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
    });
    
    // Initialize carousel
    updateCarousel();
});
