/* ==========================================================================
   LAVLESH YADAV - ADVANCED FUTURISTIC PORTFOLIO JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initEntrancePortal();
    initDynamicTypewriter();
    init3DCardParallax();
    initScrollObservers();
    initNavbarAndScroll();
    initContactForm();
    initMobileMenu();
    initDetailsAccessibility();
    initToastAndUtilities();
});

/* ==========================================================================
   1. INTERACTIVE PARTICLE & CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
    const maxDistance = 140;

    let mouse = {
        x: null,
        y: null,
        radius: 160
    };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = (Math.random() - 0.5) * 0.7;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(139, 92, 246, ';
            this.baseAlpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Mouse interaction
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const directionX = dx / dist;
                    const directionY = dy / dist;
                    this.x -= directionX * force * 3;
                    this.y -= directionY * force * 3;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.baseAlpha + ')';
            ctx.shadowBlur = 8;
            ctx.shadowColor = '#00f2fe';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. INTERACTIVE ENTRANCE PORTAL CONTROLLER
   ========================================================================== */
function initEntrancePortal() {
    const portal = document.getElementById('introPortal');
    const enterBtn = document.getElementById('enterPortalBtn');
    const replayButtons = document.querySelectorAll('.btn-replay-intro, #replayIntroBtn');
    const portalTypingElement = document.getElementById('portalTypingText');

    if (!portal) return;

    // Portal Typewriter Taglines
    if (portalTypingElement) {
        const portalPhrases = [
            'AI & Machine Learning Innovator',
            'FastAPI & Backend Developer',
            'Data Analytics & Deep Learning Specialist',
            'B.Tech CSE Student @ Amity University'
        ];
        runTypewriter(portalTypingElement, portalPhrases, 70, 40, 1800);
    }

    // Enter Portal Function
    function openPortal(e) {
        // Create ripple burst on button
        if (enterBtn && e && e.clientX) {
            const rect = enterBtn.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('portal-ripple');
            ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height) * 2}px`;
            ripple.style.left = `${e.clientX - rect.left - rect.width}px`;
            ripple.style.top = `${e.clientY - rect.top - rect.height}px`;
            enterBtn.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 750);
        }

        // Add dismiss class with smooth curtain reveal
        portal.classList.add('portal-hidden');
        sessionStorage.setItem('hasEnteredPortfolio', 'true');
        showToast('🚀 Welcome to Lavlesh Yadav\'s Universe!');
    }

    if (enterBtn) {
        enterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openPortal(e);
        });
    }

    // Keyboard support: Enter / Space to open portal when visible
    document.addEventListener('keydown', (e) => {
        if (!portal.classList.contains('portal-hidden')) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
                e.preventDefault();
                openPortal(null);
            }
        }
    });

    // Replay Intro Feature
    replayButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            portal.classList.remove('portal-hidden');
            showToast('✨ Portal Reactivated');
        });
    });
}

/* ==========================================================================
   3. DYNAMIC TYPEWRITER EFFECT
   ========================================================================== */
function initDynamicTypewriter() {
    const heroTyping = document.getElementById('heroTypingText');
    if (!heroTyping) return;

    const phrases = [
        'AI & ML Solutions',
        'High-Performance FastAPI Backends',
        'Deep Learning Architectures (CNN & LSTM)',
        'Autonomous Manufacturing Systems',
        'Data-Driven Intelligence'
    ];

    runTypewriter(heroTyping, phrases, 80, 45, 2000);
}

function runTypewriter(element, phrases, typeSpeed, deleteSpeed, holdTime) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            charIndex--;
            element.textContent = currentPhrase.substring(0, charIndex);
        } else {
            charIndex++;
            element.textContent = currentPhrase.substring(0, charIndex);
        }

        let speed = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentPhrase.length) {
            speed = holdTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(type, speed);
    }

    type();
}

/* ==========================================================================
   4. 3D CARD PARALLAX & SPOTLIGHT EFFECT
   ========================================================================== */
function init3DCardParallax() {
    const interactiveCards = document.querySelectorAll('.project-card, .skill-card, .stat-card, .project-detailed, .contact-card');

    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

/* ==========================================================================
   5. SCROLL OBSERVERS & STATS COUNTERS
   ========================================================================== */
function initScrollObservers() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // If element has skill bars inside, animate them
                const skillBars = entry.target.querySelectorAll('.skill-bar');
                skillBars.forEach(bar => {
                    const style = bar.getAttribute('style') || '';
                    if (style.includes('--progress')) {
                        bar.style.width = '100%';
                    }
                });

                // If element has stat numbers, animate counter
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.dataset.counted) {
                    statNumber.dataset.counted = 'true';
                    animateNumberCounter(statNumber);
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-card, .stat-card, .project-detailed, .education-card, .skill-category').forEach(el => {
        animateObserver.observe(el);
    });
}

function animateNumberCounter(el) {
    const rawText = el.textContent.trim();
    const targetMatch = rawText.match(/\d+/);
    if (!targetMatch) return;

    const target = parseInt(targetMatch[0], 10);
    const suffix = rawText.replace(target.toString(), '');
    let current = 0;
    const duration = 1500;
    const increment = Math.ceil(target / (duration / 25));

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = current + suffix;
    }, 25);
}

/* ==========================================================================
   6. NAVBAR & SCROLL PROGRESS
   ========================================================================== */
function initNavbarAndScroll() {
    const header = document.querySelector('.header');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar blur enhancement on scroll
        if (header) {
            if (scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/* ==========================================================================
   7. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    });

    // Escape key closes menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navMenu.classList.remove('active');
        }
    });
}

/* ==========================================================================
   8. CONTACT FORM VALIDATION & INTERACTIVITY
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous states
        clearFormErrors();
        if (formStatus) {
            formStatus.classList.remove('show', 'success', 'error');
            formStatus.textContent = '';
        }

        const formData = {
            name: document.getElementById('name')?.value || '',
            email: document.getElementById('email')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            subject: document.getElementById('subject')?.value || '',
            message: document.getElementById('message')?.value || '',
            privacy: document.getElementById('privacy')?.checked || false
        };

        const errors = {};

        if (!formData.name.trim() || formData.name.trim().length < 2) {
            errors.name = 'Please provide your full name (at least 2 characters).';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
            errors.email = 'Please enter a valid email address.';
        }

        if (!formData.subject.trim()) {
            errors.subject = 'Please select a subject for your message.';
        }

        if (!formData.message.trim() || formData.message.trim().length < 10) {
            errors.message = 'Message must be at least 10 characters long.';
        }

        if (!formData.privacy) {
            errors.privacy = 'Please agree to the terms to proceed.';
        }

        if (Object.keys(errors).length > 0) {
            displayFormErrors(errors);
            if (formStatus) {
                formStatus.textContent = 'Please correct the highlighted fields above.';
                formStatus.classList.add('show', 'error');
            }
            return;
        }

        // Success simulation
        if (formStatus) {
            formStatus.textContent = '✓ Message received! Thank you, Lavlesh will get back to you shortly.';
            formStatus.classList.add('show', 'success');
        }
        showToast('✉️ Message sent successfully!');
        contactForm.reset();

        setTimeout(() => {
            if (formStatus) formStatus.classList.remove('show');
        }, 6000);
    });

    function displayFormErrors(errors) {
        Object.keys(errors).forEach(fieldName => {
            const input = document.getElementById(fieldName);
            const help = document.getElementById(`${fieldName}-help`);
            if (input) input.style.borderColor = '#f43f5e';
            if (help) {
                help.textContent = errors[fieldName];
                help.classList.add('show');
            }
        });
    }

    function clearFormErrors() {
        document.querySelectorAll('.form-help').forEach(help => {
            help.textContent = '';
            help.classList.remove('show');
        });
        document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
            input.style.borderColor = '';
        });
    }
}

/* ==========================================================================
   9. DETAILS ACCESSIBILITY
   ========================================================================== */
function initDetailsAccessibility() {
    document.querySelectorAll('details').forEach(detail => {
        const summary = detail.querySelector('summary');
        if (!summary) return;

        detail.addEventListener('toggle', () => {
            summary.setAttribute('aria-expanded', detail.open);
        });
        summary.setAttribute('aria-expanded', detail.open);
    });
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS & UTILITIES
   ========================================================================== */
function initToastAndUtilities() {
    // Set current year in footer
    const currentYearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    currentYearElements.forEach(el => {
        el.textContent = currentYear;
    });

    // Create Toast Container if not present
    if (!document.getElementById('portfolioToast')) {
        const toast = document.createElement('div');
        toast.id = 'portfolioToast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
}

function showToast(message) {
    const toast = document.getElementById('portfolioToast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3500);
}
