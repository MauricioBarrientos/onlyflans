// web/static/web/js/main.js

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll for hero CTA
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        heroCta.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Form enhancements
    enhanceForms();

    // Navbar enhancements
    enhanceNavbar();

    // Product card interactions
    enhanceProductCards();

    // Scroll effects
    addScrollEffects();
});

function enhanceForms() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const submitBtn = form.querySelector('button[type="submit"], .btn-form');
        const inputs = form.querySelectorAll('input, textarea, select');

        // Real-time validation
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });

        // Form submission with loading state
        form.addEventListener('submit', function(e) {
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
            }
        });
    });
}

function validateField(field) {
    const formGroup = field.closest('.form-group');
    const message = formGroup.querySelector('.form-message');

    // Remove previous validation classes
    formGroup.classList.remove('error', 'success');
    if (message) {
        message.remove();
    }

    let isValid = true;
    let errorMessage = '';

    // Basic validation rules
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Este campo es obligatorio';
    } else if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Ingresa un email válido';
        }
    } else if (field.type === 'password' && field.value.length < 6) {
        isValid = false;
        errorMessage = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Apply validation styling
    if (!isValid) {
        formGroup.classList.add('error');
        if (errorMessage) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-message error';
            errorDiv.textContent = errorMessage;
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
    } else if (field.value.trim()) {
        formGroup.classList.add('success');
    }

    return isValid;
}

function enhanceNavbar() {
    const navbar = document.querySelector('.navbar-custom');

    if (navbar) {
        // Add sticky behavior
        let lastScrollTop = 0;
        const navbarHeight = navbar.offsetHeight;

        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop && scrollTop > navbarHeight) {
                // Scrolling down
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        });

        // Update cart count (if cart functionality exists)
        updateCartCount();
    }
}

function updateCartCount() {
    // This would typically fetch cart count from server
    // For now, just update based on local storage or similar
    const cartCount = localStorage.getItem('cartCount') || 0;
    const cartIndicator = document.querySelector('.cart-count');

    if (cartIndicator) {
        cartIndicator.textContent = cartCount;
        cartIndicator.style.display = cartCount > 0 ? 'flex' : 'none';
    }
}

function enhanceProductCards() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        // Add subtle entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, Math.random() * 300);

        // Enhanced hover effects
        const image = card.querySelector('.product-card__image');
        if (image) {
            card.addEventListener('mouseenter', function() {
                image.style.transform = 'scale(1.08)';
            });

            card.addEventListener('mouseleave', function() {
                image.style.transform = 'scale(1.05)'; // Keep slight zoom on hover out
            });
        }
    });
}

function addScrollEffects() {
    // Add intersection observer for fade-in effects
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements that should fade in
    const fadeElements = document.querySelectorAll('.product-card, .form-container');
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function showToast(message, type = 'info') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-message">${message}</span>
            <button class="toast-close">&times;</button>
        </div>
    `;

    // Add to page
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto hide
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

// Export functions for potential use in other scripts
window.OnlyFlans = {
    showToast,
    updateCartCount,
    validateField
};