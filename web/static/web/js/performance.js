// web/static/web/js/performance.js
// Performance optimizations for OnlyFlans

class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupResourceHints();
        this.setupServiceWorker();
        this.optimizeAnimations();
        this.setupCriticalCSS();
    }

    // Lazy loading for images
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all images with data-src
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
        }
    }

    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => this.loadImage(img));
    }

    // Image optimization
    setupImageOptimization() {
        // Add responsive image support
        const images = document.querySelectorAll('img:not([data-no-optimize])');
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add decoding hint for better performance
            if (!img.hasAttribute('decoding')) {
                img.setAttribute('decoding', 'async');
            }

            // Add fetchpriority for critical images
            if (img.classList.contains('critical-image') && !img.hasAttribute('fetchpriority')) {
                img.setAttribute('fetchpriority', 'high');
            }
        });
    }

    // Resource hints for performance
    setupResourceHints() {
        const head = document.head;

        // Preconnect to external domains
        const preconnectDomains = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.jsdelivr.net'
        ];

        preconnectDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            head.appendChild(link);
        });

        // DNS prefetch for additional domains
        const dnsDomains = [
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com'
        ];

        dnsDomains.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = domain;
            head.appendChild(link);
        });
    }

    // Basic service worker for caching
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Optimize animations for performance
    optimizeAnimations() {
        // Reduce motion for users who prefer it
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // Disable animations for users who prefer reduced motion
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Use transform and opacity for better performance
        this.optimizeTransformAnimations();
    }

    optimizeTransformAnimations() {
        // Ensure animations use transform and opacity
        const animatedElements = document.querySelectorAll('.product-card, .modal, .toast');
        animatedElements.forEach(el => {
            // Force hardware acceleration
            el.style.willChange = 'transform, opacity';
        });
    }

    // Critical CSS inlining (for production)
    setupCriticalCSS() {
        // This would typically be handled by build tools
        // For now, we'll just mark critical resources
        const criticalImages = document.querySelectorAll('.hero-background img, .product-card__image:first-child');
        criticalImages.forEach(img => img.classList.add('critical-image'));
    }

    // Memory management
    cleanup() {
        // Clean up event listeners and observers when needed
        // This would be called when navigating away or on page unload
    }
}

// Web Vitals monitoring
class WebVitalsMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Monitor Core Web Vitals
        this.monitorCLS();
        this.monitorFID();
        this.monitorLCP();
    }

    monitorCLS() {
        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            }
            console.log('CLS:', clsValue);
        }).observe({ type: 'layout-shift', buffered: true });
    }

    monitorFID() {
        // First Input Delay
        new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                console.log('FID:', entry.processingStart - entry.startTime);
            }
        }).observe({ type: 'first-input', buffered: true });
    }

    monitorLCP() {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
        }).observe({ type: 'largest-contentful-paint', buffered: true });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    new PerformanceOptimizer();
    new WebVitalsMonitor();
});

// Export for potential use
window.PerformanceOptimizer = PerformanceOptimizer;
window.WebVitalsMonitor = WebVitalsMonitor;