// ============================================
// Hamburger Menu Toggle
// ============================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// ============================================
// Anime.js Setup
// ============================================

// Hero Section Animation - On Page Load
anime.timeline()
    .add({
        targets: '.hero',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutQuad',
        delay: 200
    });

// Section Titles - Fade in and scale
anime.set('.section-title', { opacity: 0, scale: 0.95 });

// Products Grid Stagger Animation
anime.set('.product-card', { opacity: 0, translateY: 40 });

// Testimonials Stagger Animation
anime.set('.testimonial-card', { opacity: 0, translateY: 40 });

// Promotions Stagger Animation
anime.set('.promo-card', { opacity: 0, translateY: 40 });

// Footer Fade In
anime.set('.footer-container', { opacity: 0, translateY: 30 });

// ============================================
// Intersection Observer for Scroll Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;

            if (element.classList.contains('section-title')) {
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
                observer.unobserve(element);
            }

            if (element.classList.contains('product-card')) {
                const cards = document.querySelectorAll('.product-card');
                anime({
                    targets: cards,
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 500,
                    delay: anime.stagger(100),
                    easing: 'easeOutQuad'
                });
                observer.unobserve(element);
            }

            if (element.classList.contains('testimonial-card')) {
                const cards = document.querySelectorAll('.testimonial-card');
                anime({
                    targets: cards,
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 500,
                    delay: anime.stagger(100),
                    easing: 'easeOutQuad'
                });
                entries.forEach(e => {
                    if (e.target.classList.contains('testimonial-card')) {
                        observer.unobserve(e.target);
                    }
                });
            }

            if (element.classList.contains('promo-card')) {
                const cards = document.querySelectorAll('.promo-card');
                anime({
                    targets: cards,
                    opacity: [0, 1],
                    translateY: [40, 0],
                    duration: 500,
                    delay: anime.stagger(100),
                    easing: 'easeOutQuad'
                });
                entries.forEach(e => {
                    if (e.target.classList.contains('promo-card')) {
                        observer.unobserve(e.target);
                    }
                });
            }

            if (element.classList.contains('footer-container')) {
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
                observer.unobserve(element);
            }
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all animated elements
document.querySelectorAll('.section-title').forEach(el => observer.observe(el));
document.querySelectorAll('.product-card').forEach(el => observer.observe(el));
document.querySelectorAll('.testimonial-card').forEach(el => observer.observe(el));
document.querySelectorAll('.promo-card').forEach(el => observer.observe(el));
document.querySelectorAll('.footer-container').forEach(el => observer.observe(el));

// ============================================
// Navigation Icons Hover Animation
// ============================================

const navIcons = document.querySelectorAll('.nav-link');
navIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        anime({
            targets: icon,
            scale: [1, 1.15],
            color: ['#ffffff', '#06b3c9'],
            duration: 300,
            easing: 'easeOutQuad'
        });
    });

    icon.addEventListener('mouseleave', () => {
        anime({
            targets: icon,
            scale: [1.15, 1],
            color: ['#06b3c9', '#ffffff'],
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
});

// ============================================
// Button Interactions
// ============================================

const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        anime({
            targets: button,
            scale: [1, 1.08],
            duration: 300,
            easing: 'easeOutQuad'
        });

        // Add pulse effect with a nested animation
        anime({
            targets: button,
            boxShadow: [
                '0px 0px 0px rgba(6, 179, 201, 0)',
                '0px 0px 20px rgba(6, 179, 201, 0.5)',
                '0px 0px 0px rgba(6, 179, 201, 0)'
            ],
            duration: 1000,
            easing: 'easeInOutQuad',
            loop: true
        });
    });

    button.addEventListener('mouseleave', () => {
        anime.set(button, {
            scale: 1,
            boxShadow: '0px 0px 0px rgba(6, 179, 201, 0)'
        });
    });
});

// ============================================
// Card Hover Effects
// ============================================

const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        anime({
            targets: card,
            translateY: [-8, 0],
            duration: 400,
            easing: 'easeOutQuad'
        });

        // Subtle image scale on hover
        const img = card.querySelector('img');
        if (img) {
            anime({
                targets: img,
                scale: [1, 1.05],
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    });

    card.addEventListener('mouseleave', () => {
        anime({
            targets: card,
            translateY: 0,
            duration: 400,
            easing: 'easeOutQuad'
        });

        const img = card.querySelector('img');
        if (img) {
            anime({
                targets: img,
                scale: 1,
                duration: 400,
                easing: 'easeOutQuad'
            });
        }
    });
});

const testimonialCards = document.querySelectorAll('.testimonial-card');
testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        anime({
            targets: card,
            translateY: [-5, 0],
            boxShadow: ['0px 2px 12px rgba(0, 0, 0, 0.1)', '0px 8px 24px rgba(0, 0, 0, 0.15)'],
            duration: 400,
            easing: 'easeOutQuad'
        });
    });

    card.addEventListener('mouseleave', () => {
        anime({
            targets: card,
            translateY: 0,
            boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
            duration: 400,
            easing: 'easeOutQuad'
        });
    });
});

const promoCards = document.querySelectorAll('.promo-card');
promoCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        anime({
            targets: card,
            translateY: [-5, 0],
            boxShadow: ['0px 2px 12px rgba(0, 0, 0, 0.1)', '0px 8px 24px rgba(0, 0, 0, 0.15)'],
            duration: 400,
            easing: 'easeOutQuad'
        });
    });

    card.addEventListener('mouseleave', () => {
        anime({
            targets: card,
            translateY: 0,
            boxShadow: '0px 2px 12px rgba(0, 0, 0, 0.1)',
            duration: 400,
            easing: 'easeOutQuad'
        });
    });
});

// ============================================
// Social Icons Hover Animation
// ============================================

const socialIcons = document.querySelectorAll('.social-icon');
socialIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
        anime({
            targets: icon,
            scale: [1, 1.1],
            backgroundColor: ['rgba(255, 255, 255, 0.1)', '#06b3c9'],
            duration: 300,
            easing: 'easeOutQuad'
        });
    });

    icon.addEventListener('mouseleave', () => {
        anime({
            targets: icon,
            scale: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            duration: 300,
            easing: 'easeOutQuad'
        });
    });
});

// ============================================
// Smooth Scroll Behavior
// ============================================

// Add smooth scroll to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            anime({
                targets: window,
                scrollTop: target.offsetTop,
                duration: 800,
                easing: 'easeInOutQuad'
            });
        }
    });
});

// ============================================
// Page Load Animation Timeline
// ============================================

const pageLoadTimeline = anime.timeline();

pageLoadTimeline
    .add({
        targets: '.header',
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
    }, 0)
    .add({
        targets: '.navbar',
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutQuad'
    }, 100)
    .add({
        targets: '.hero',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutQuad'
    }, 200);

console.log('Wall2Wall animations loaded successfully!');
