// ===== DOM Elements =====
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const currentYearElements = document.querySelectorAll('#current-year');

// ===== Mobile Menu Toggle =====
if (menuToggle) {
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
}

// ===== Set Current Year in Footer =====
function setCurrentYear() {
    const currentYear = new Date().getFullYear();
    currentYearElements.forEach(element => {
        element.textContent = currentYear;
    });
}

// ===== Form Validation =====
function validateForm(formData) {
    const errors = {};

    // Name validation
    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone validation (if provided)
    if (formData.phone.trim()) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
    }

    // Subject validation
    if (!formData.subject.trim()) {
        errors.subject = 'Please select a subject';
    }

    // Message validation
    if (!formData.message.trim()) {
        errors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }

    // Privacy checkbox validation
    if (!formData.privacy) {
        errors.privacy = 'You must agree to the privacy policy';
    }

    return errors;
}

// ===== Display Form Errors =====
function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.form-help').forEach(help => {
        help.textContent = '';
        help.classList.remove('show');
    });

    document.querySelectorAll('.form-input, .form-textarea, input[type="checkbox"]').forEach(input => {
        input.style.borderColor = '';
    });

    // Display new errors
    Object.keys(errors).forEach(fieldName => {
        const input = document.getElementById(fieldName);
        const helpElement = document.getElementById(`${fieldName}-help`);

        if (input) {
            input.style.borderColor = '#ef4444';
        }

        if (helpElement) {
            helpElement.textContent = errors[fieldName];
            helpElement.classList.add('show');
        }
    });
}

// ===== Clear Form Errors =====
function clearFormErrors() {
    document.querySelectorAll('.form-help').forEach(help => {
        help.textContent = '';
        help.classList.remove('show');
    });

    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.style.borderColor = '';
    });
}

// ===== Handle Form Submission =====
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        clearFormErrors();
        formStatus.classList.remove('show', 'success', 'error');
        formStatus.textContent = '';

        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            privacy: document.getElementById('privacy').checked
        };

        // Validate form
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            displayFormErrors(errors);
            formStatus.textContent = 'Please fix the errors above';
            formStatus.classList.add('show', 'error');
            return;
        }

        // Simulate form submission
        try {
            // In production, you would send this data to your server
            console.log('Form data:', formData);

            formStatus.textContent = '✓ Thank you! Your message has been sent. I\'ll get back to you soon!';
            formStatus.classList.add('show', 'success');

            // Reset form
            contactForm.reset();

            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.classList.remove('show');
            }, 5000);

        } catch (error) {
            formStatus.textContent = '✗ Something went wrong. Please try again.';
            formStatus.classList.add('show', 'error');
            console.error('Form submission error:', error);
        }
    });

    // Real-time validation on input
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('blur', () => {
            const fieldName = input.id;
            const helpElement = document.getElementById(`${fieldName}-help`);

            if (!helpElement) return;

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                privacy: document.getElementById('privacy').checked
            };

            const errors = validateForm(formData);

            if (errors[fieldName]) {
                input.style.borderColor = '#ef4444';
                helpElement.textContent = errors[fieldName];
                helpElement.classList.add('show');
            } else {
                input.style.borderColor = '';
                helpElement.textContent = '';
                helpElement.classList.remove('show');
            }
        });
    });
}

// ===== Enhanced Accessibility for Details Elements =====
document.querySelectorAll('details').forEach(detail => {
    const summary = detail.querySelector('summary');

    detail.addEventListener('toggle', () => {
        summary.setAttribute('aria-expanded', detail.open);
    });

    // Set initial state
    summary.setAttribute('aria-expanded', detail.open);
});

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

// ===== Scroll Animations =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all project cards and skill cards
document.querySelectorAll('.project-card, .skill-card, .stat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
});

// ===== Active Navigation Link on Scroll =====
function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
        }
    });
}

window.addEventListener('scroll', updateActiveNavLink);

// ===== Keyboard Navigation Support =====
document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('active');
    }
});

// ===== Focus Management for Links =====
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid #0ea5e9';
        element.style.outlineOffset = '2px';
    });

    element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
    });
});

// ===== Lazy Loading for Images (if any) =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ===== Print Optimization =====
window.addEventListener('beforeprint', () => {
    // Expand all details elements for printing
    document.querySelectorAll('details').forEach(detail => {
        detail.open = true;
    });
});

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    console.log('Portfolio website loaded successfully');
});

// ===== Error Boundary =====
window.addEventListener('error', (error) => {
    console.error('Global error:', error);
});

// ===== Performance Monitoring =====
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log('Page load time:', pageLoadTime + 'ms');
    });
}
