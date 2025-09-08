// Olle Tidbloms CV - Bootstrap Enhanced JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize scroll progress bar
    createScrollProgress();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize navigation effects
    initNavigationEffects();
    
    // Initialize timeline animations
    initTimelineAnimations();
    
    // Initialize company card effects
    initCompanyCardEffects();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize video controls
    initVideoControls();
    
    console.log('🎹 CV website initialized successfully! 🚀');
});

// Video control funktioner
function toggleVideo(button) {
    const video = button.parentElement.querySelector('video');
    const icon = button.querySelector('i');
    
    if (video.paused) {
        video.play();
        icon.className = 'fas fa-pause';
        button.setAttribute('aria-label', 'Pausa video');
    } else {
        video.pause();
        icon.className = 'fas fa-play';
        button.setAttribute('aria-label', 'Spela video');
    }
}

function initVideoControls() {
    const videos = document.querySelectorAll('.about-video');
    
    videos.forEach(video => {
        // Hantera video events
        video.addEventListener('loadstart', function() {
            console.log('Video börjar ladda...');
        });
        
        video.addEventListener('canplay', function() {
            console.log('Video är redo att spelas!');
        });
        
        video.addEventListener('error', function() {
            console.log('Video kunde inte laddas, visar fallback-bild');
            // Visa fallback-bild om video inte fungerar
            const fallbackImg = this.querySelector('img');
            if (fallbackImg) {
                this.style.display = 'none';
                fallbackImg.style.display = 'block';
            }
        });
        
        // Pausa video när den inte är synlig (performance)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (video.hasAttribute('autoplay')) {
                        video.play();
                    }
                } else {
                    video.pause();
                }
            });
        });
        
        observer.observe(video);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });
}

// Navigation effects on scroll
function initNavigationEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.classList.remove('navbar-scrolled');
            navbar.style.background = '';
            navbar.style.backdropFilter = '';
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    const timelineItems = document.querySelectorAll('.timeline-item');
                    timelineItems.forEach((item, index) => {
                        if (item === entry.target) {
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, index * 200);
                        }
                    });
                }
                
                // Remove observer once element is visible for performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animations
    document.querySelectorAll('.fade-in, .timeline-item, .card').forEach(el => {
        observer.observe(el);
    });
}

// Timeline hover effects
function initTimelineAnimations() {
    document.querySelectorAll('.timeline-content').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Enhanced company card effects
function initCompanyCardEffects() {
    document.querySelectorAll('.company-card').forEach((card, index) => {
        // Add stagger animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
        
        // Add smooth hover transition
        card.addEventListener('mouseenter', function() {
            const cardInner = this.querySelector('.company-card-inner');
            cardInner.style.transform = 'translateY(-10px)';
            cardInner.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            const cardInner = this.querySelector('.company-card-inner');
            cardInner.style.transform = 'translateY(0)';
        });
    });
}

// Create ripple effect for interactive elements
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 1000;
    `;
    
    // Ensure parent has relative positioning
    if (getComputedStyle(element).position === 'static') {
        element.style.position = 'relative';
    }
    element.style.overflow = 'hidden';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation CSS
function addRippleStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Scroll progress indicator
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero-section');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroHeight = hero.offsetHeight;
        
        if (scrolled < heroHeight) {
            const yPos = -(scrolled * 0.3);
            hero.style.transform = `translateY(${yPos}px)`;
        }
    });
}

// Typing effect for hero title (optional)
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.dataset.typing === 'true') {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid #fff';
        
        let i = 0;
        const typingEffect = setInterval(() => {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingEffect);
                heroTitle.style.borderRight = 'none';
            }
        }, 100);
    }
}

// Lazy loading for video
function initVideoLazyLoading() {
    const videoContainer = document.querySelector('.video-container');
    if (videoContainer) {
        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target.querySelector('iframe');
                    if (iframe && iframe.dataset.src) {
                        iframe.src = iframe.dataset.src;
                        iframe.removeAttribute('data-src');
                    }
                    videoObserver.unobserve(entry.target);
                }
            });
        });
        
        videoObserver.observe(videoContainer);
    }
}

// Active navigation link highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize additional effects
document.addEventListener('DOMContentLoaded', function() {
    addRippleStyles();
    initParallaxEffect();
    initVideoLazyLoading();
    initActiveNavigation();
});

// Skills animation on hover
document.addEventListener('DOMContentLoaded', function() {
    const skillBadges = document.querySelectorAll('.badge');
    
    skillBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Add loading screen (optional)
function addLoadingScreen() {
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div class="d-flex justify-content-center align-items-center position-fixed w-100 h-100" 
             style="top: 0; left: 0; background: #000; z-index: 9999;">
            <div class="text-center text-white">
                <div class="spinner-border text-light mb-3" role="status"></div>
                <h4>Laddar CV...</h4>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.remove();
        }, 1000);
    });
}
