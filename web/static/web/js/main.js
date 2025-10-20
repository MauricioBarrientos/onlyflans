// web/static/web/js/main.js

// Global state
let cartCount = parseInt(localStorage.getItem('cartCount')) || 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all enhancements
    initializeApp();

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

    // Modal systems
    initializeModals();

    // Gallery functionality
    initializeGalleries();

    // Quantity selectors
    initializeQuantitySelectors();

    // Product detail page enhancements
    initializeProductDetail();

    // Scroll effects
    addScrollEffects();

    // Update cart display
    updateCartDisplay();
});

function initializeApp() {
    // Load cart data from localStorage
    updateCartCount();

    // Initialize toast container
    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
}

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

// Modal System Functions
function initializeModals() {
    // Cart modal trigger
    const cartTriggers = document.querySelectorAll('[data-bs-target="#cartModal"]');
    cartTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            showCartModal();
        });
    });

    // Quick view modal triggers
    const quickViewTriggers = document.querySelectorAll('[data-quick-view]');
    quickViewTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-quick-view');
            showQuickViewModal(productId);
        });
    });
}

function showCartModal() {
    const modalHtml = `
        <div class="modal fade cart-modal" id="cartModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tu Carrito</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="cartItems">
                            ${renderCartItems()}
                        </div>
                        ${cartItems.length > 0 ? `<div class="cart-total">Total: $${calculateCartTotal()}</div>` : '<p class="text-center text-muted">Tu carrito está vacío</p>'}
                    </div>
                    ${cartItems.length > 0 ? `
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Continuar Comprando</button>
                        <a href="{% url 'carrito' %}" class="btn btn-primary">Ver Carrito Completo</a>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if present
    const existingModal = document.getElementById('cartModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
}

function renderCartItems() {
    if (cartItems.length === 0) {
        return '<p class="text-center text-muted">Tu carrito está vacío</p>';
    }

    return cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateCartItemQuantity(${item.id}, this.value)">
                <button class="quantity-btn" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem(${item.id})">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                </svg>
            </button>
        </div>
    `).join('');
}

function calculateCartTotal() {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function showQuickViewModal(productId) {
    // This would typically fetch product data via AJAX
    // For now, we'll create a placeholder modal
    const modalHtml = `
        <div class="modal fade quick-view-modal" id="quickViewModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Vista Rápida</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <div class="product-gallery">
                                    <div class="gallery-main-image">
                                        <img src="/static/OnlyFlans.png" alt="Producto" class="zoom-container">
                                    </div>
                                    <div class="gallery-thumbnails">
                                        <img src="/static/OnlyFlans.png" alt="Thumbnail 1" class="thumbnail-item active">
                                        <img src="/static/OnlyFlans.png" alt="Thumbnail 2" class="thumbnail-item">
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="quick-view-info">
                                    <h3>Producto de Ejemplo</h3>
                                    <div class="quick-view-rating">
                                        <span>★★★★☆</span>
                                        <span>(4.5)</span>
                                    </div>
                                    <div class="quick-view-price">$2.500</div>
                                    <p class="quick-view-description">
                                        Descripción detallada del producto con información completa sobre sus características y beneficios.
                                    </p>
                                    <div class="quantity-selector mb-3">
                                        <button class="quantity-btn">-</button>
                                        <input type="number" class="quantity-input" value="1" min="1">
                                        <button class="quantity-btn">+</button>
                                    </div>
                                    <button class="btn btn-primary btn-lg">Añadir al Carrito</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if present
    const existingModal = document.getElementById('quickViewModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Initialize gallery functionality
    initializeGalleryInModal();

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
    modal.show();
}

// Gallery Functions
function initializeGalleries() {
    // Initialize zoom functionality
    const zoomContainers = document.querySelectorAll('.zoom-container');
    zoomContainers.forEach(container => {
        container.addEventListener('click', function() {
            showImageZoom(this.src);
        });
    });

    // Initialize thumbnail galleries
    const galleries = document.querySelectorAll('.product-gallery');
    galleries.forEach(gallery => {
        initializeThumbnailGallery(gallery);
    });
}

function initializeGalleryInModal() {
    const modalGallery = document.querySelector('#quickViewModal .product-gallery');
    if (modalGallery) {
        initializeThumbnailGallery(modalGallery);
    }
}

function initializeThumbnailGallery(gallery) {
    const thumbnails = gallery.querySelectorAll('.thumbnail-item');
    const mainImage = gallery.querySelector('.gallery-main-image img');

    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            if (mainImage) {
                mainImage.src = this.src;
            }

            // Update active thumbnail
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showImageZoom(imageSrc) {
    const zoomHtml = `
        <div class="image-zoom-overlay" onclick="closeImageZoom()">
            <div class="image-zoom-container">
                <img src="${imageSrc}" alt="Zoomed image">
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', zoomHtml);

    // Add close functionality
    setTimeout(() => {
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeImageZoom();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }, 100);
}

function closeImageZoom() {
    const overlay = document.querySelector('.image-zoom-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Quantity Selector Functions
function initializeQuantitySelectors() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            e.preventDefault();
            const input = e.target.parentNode.querySelector('.quantity-input');
            const currentValue = parseInt(input.value) || 1;

            if (e.target.textContent === '+') {
                input.value = currentValue + 1;
            } else if (e.target.textContent === '-' && currentValue > 1) {
                input.value = currentValue - 1;
            }

            // Trigger change event
            input.dispatchEvent(new Event('change'));
        }
    });
}

// Cart Functions
function updateCartCount() {
    const cartIndicator = document.querySelector('.cart-count');
    if (cartIndicator) {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartIndicator.textContent = totalItems;
        cartIndicator.style.display = totalItems > 0 ? 'flex' : 'none';
        localStorage.setItem('cartCount', totalItems);
    }
}

function updateCartDisplay() {
    updateCartCount();
}

function addToCart(productId, name, price, image) {
    const existingItem = cartItems.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            id: productId,
            name: name,
            price: parseFloat(price),
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();

    showToast('Producto añadido al carrito', 'success');
}

function updateCartItemQuantity(productId, newQuantity) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, parseInt(newQuantity) || 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();

        // Update modal if open
        const modal = document.getElementById('cartModal');
        if (modal && modal.classList.contains('show')) {
            const cartItemsContainer = modal.querySelector('#cartItems');
            if (cartItemsContainer) {
                cartItemsContainer.innerHTML = renderCartItems();
                const totalElement = modal.querySelector('.cart-total');
                if (totalElement) {
                    totalElement.textContent = `Total: $${calculateCartTotal()}`;
                }
            }
        }
    }
}

function removeCartItem(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartDisplay();

    // Update modal if open
    const modal = document.getElementById('cartModal');
    if (modal && modal.classList.contains('show')) {
        const cartItemsContainer = modal.querySelector('#cartItems');
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = renderCartItems();
            const totalElement = modal.querySelector('.cart-total');
            if (totalElement) {
                totalElement.textContent = `Total: $${calculateCartTotal()}`;
            }
        }
    }

    showToast('Producto eliminado del carrito', 'info');
}

// Enhanced Toast System
function showToast(message, type = 'info', duration = 5000) {
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
        success: '✓',
        error: '✕',
        info: 'ℹ',
        warning: '⚠'
    };

    toast.innerHTML = `
        <div class="toast-icon">${iconMap[type] || 'ℹ'}</div>
        <div class="toast-content">
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto hide
    const hideTimeout = setTimeout(() => {
        hideToast(toast);
    }, duration);

    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        clearTimeout(hideTimeout);
        hideToast(toast);
    });
}

function hideToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

// Skeleton Loading Functions
function showSkeleton(container, type = 'card') {
    const skeletonHtml = type === 'card' ? `
        <div class="skeleton-card">
            <div class="skeleton-image"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-button"></div>
        </div>
    ` : '';

    container.innerHTML = skeletonHtml;
}

function hideSkeleton(container) {
    // This would be called after content loads
    container.innerHTML = '';
}

// Product Detail Page Functions
function initializeProductDetail() {
    // Sync quantity selector with cart form
    const quantityInput = document.getElementById('product-quantity');
    const cartQuantityInput = document.getElementById('cart-quantity');
    const addToCartForm = document.getElementById('add-to-cart-form');

    if (quantityInput && cartQuantityInput) {
        // Sync on quantity change
        quantityInput.addEventListener('change', function() {
            cartQuantityInput.value = this.value;
        });

        // Update quantity buttons
        const quantityBtns = document.querySelectorAll('.quantity-selector .quantity-btn');
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const isPlus = this.textContent === '+';
                const currentValue = parseInt(quantityInput.value) || 1;
                const newValue = isPlus ? currentValue + 1 : Math.max(1, currentValue - 1);

                quantityInput.value = newValue;
                cartQuantityInput.value = newValue;

                // Trigger change event
                quantityInput.dispatchEvent(new Event('change'));
            });
        });
    }

    // Enhanced add to cart with loading state
    if (addToCartForm) {
        addToCartForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Añadiendo...';
            }
        });
    }

    // Review form enhancements
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.classList.add('loading');
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';
            }
        });
    }
}

// Enhanced Cart Functions with AJAX simulation
function addToCart(productId, name, price, image, quantity = 1) {
    // Simulate AJAX call
    showSkeleton(document.querySelector('.cart-indicator'), 'button');

    setTimeout(() => {
        hideSkeleton(document.querySelector('.cart-indicator'));

        const existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cartItems.push({
                id: productId,
                name: name,
                price: parseFloat(price),
                image: image,
                quantity: quantity
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartDisplay();

        showToast(`"${name}" añadido al carrito (${quantity} ${quantity === 1 ? 'unidad' : 'unidades'})`, 'success');
    }, 500);
}

// Export functions for potential use in other scripts
window.OnlyFlans = {
    showToast,
    updateCartCount,
    validateField,
    addToCart,
    updateCartItemQuantity,
    removeCartItem,
    showSkeleton,
    hideSkeleton,
    showImageZoom,
    closeImageZoom
};