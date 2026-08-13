// ===== Hacker Terminal Portfolio Script =====

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeFormHandlers();
    initializeScrollAnimations();
    initializeTypewriterEffect();
    updateActiveNav();
});

// ===== Navigation Initialization =====
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '').replace('hacker-', '');

    navLinks.forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage || (currentPage === '' && page === 'home')) {
            link.classList.add('active');
        }
    });
}

// ===== Update Active Navigation Link =====
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ===== Form Handlers =====
function initializeFormHandlers() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('reset', handleFormReset);

    // Real-time focus effect
    const inputs = form.querySelectorAll('.form-input, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', (e) => {
            e.target.parentElement.style.position = 'relative';
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const status = document.getElementById('formStatus');

    // Validation
    if (!name || !email || !message) {
        showStatus(status, 'Please fill in all fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showStatus(status, 'Please enter a valid email address.', 'error');
        return;
    }

    if (message.length < 10) {
        showStatus(status, 'Message must be at least 10 characters.', 'error');
        return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '< Sending... />';
    submitBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        showStatus(status, '✓ Message received! I\'ll get back to you soon.', 'success');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function handleFormReset(e) {
    const form = e.target;
    const status = document.getElementById('formStatus');
    if (status) {
        status.classList.remove('show', 'success', 'error');
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showStatus(statusElement, message, type) {
    if (!statusElement) return;

    statusElement.textContent = message;
    statusElement.className = `form-status show ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            statusElement.classList.remove('show');
        }, 4000);
    }
}

// ===== Scroll Animations =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe featured cards, project cards, and skill items
    document.querySelectorAll('.featured-card, .project-card, .skill-item, .stat-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // Animate skill progress bars on scroll
    const skillProgressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progresses = entry.target.querySelectorAll('.skill-progress');
                progresses.forEach(prog => {
                    prog.style.animation = 'none';
                    setTimeout(() => {
                        prog.style.animation = 'none';
                    }, 10);
                });
                skillProgressObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const skillsSection = document.querySelector('.skills-preview') || document.querySelector('.skills-display');
    if (skillsSection) {
        skillProgressObserver.observe(skillsSection);
    }
}

// ===== Typewriter Effect =====
function initializeTypewriterEffect() {
    const textLine = document.querySelector('.text-line');
    if (!textLine) return;

    const text = textLine.textContent;
    textLine.textContent = '';
    let index = 0;

    function typeWriter() {
        if (index < text.length) {
            textLine.textContent += text[index];
            index++;
            setTimeout(typeWriter, 30);
        }
    }

    // Start after a short delay
    setTimeout(typeWriter, 500);
}

// ===== Smooth Scroll Behavior =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ===== Add Glowing Effect on Hover for Project Cards =====
document.querySelectorAll('.featured-card, .project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Optional: Add subtle gradient effect
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', '50%');
        card.style.setProperty('--mouse-y', '50%');
    });
});

// ===== Cursor Trail Effect (Optional) =====
function initializeCursorTrail() {
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // You can add custom cursor effects here if needed
}

// ===== Active Link Update on Navigation =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('class');
        }
    });
});

// ===== Add Ripple Effect to Buttons =====
document.querySelectorAll('.cta-button, .view-button, .form-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// ===== Terminal Cursor Blink =====
function initializeTerminalCursor() {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;

    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '1' ? '0' : '1';
    }, 500);
}

initializeTerminalCursor();

// ===== Mobile Menu Toggle (If needed in future) =====
function initializeMobileMenu() {
    const navPill = document.querySelector('.nav-pill');
    if (!navPill) return;

    // Handle responsive behavior
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Desktop view - show all
            document.querySelectorAll('.nav-link').forEach(link => {
                link.style.display = 'block';
            });
        }
    });
}

// ===== Initialize on Load =====
window.addEventListener('load', () => {
    initializeMobileMenu();

    // Add subtle animations to stats
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const finalValue = stat.textContent;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(stat, finalValue);
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(stat);
    });
});

function animateNumber(element, finalValue) {
    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    const suffix = finalValue.replace(/\d/g, '').trim();
    let current = 0;
    const increment = numericValue / 30;

    const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
            element.textContent = finalValue;
            clearInterval(interval);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 30);
}

// ===== Page Load Feedback =====
console.log('%c🎮 Hacker Terminal Portfolio', 'color: #00FF9C; font-size: 20px; font-weight: bold;');
console.log('%cLoaded successfully', 'color: #00F0FF; font-size: 14px;');
