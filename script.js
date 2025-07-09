$(document).ready(function() {
    // Performance optimization: Throttle scroll events
    let ticking = false;
    function updateOnScroll() {
        ticking = false;
        // Scroll-based animations will be handled here
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }

    // Smooth scrolling for navigation links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 800, 'easeInOutCubic');
        }
    });

    // Mobile menu toggle
    $('#mobile-menu-btn').on('click', function() {
        $('#mobile-menu').slideToggle(300);
        $(this).find('i').toggleClass('fa-bars fa-times');
    });

    // Optimized navbar background change on scroll
    let lastScrollTop = 0;
    $(window).on('scroll', function() {
        requestTick();
        const scrollTop = $(window).scrollTop();
        
        // Only update if scroll position changed significantly
        if (Math.abs(scrollTop - lastScrollTop) > 10) {
            if (scrollTop > 50) {
                $('#navbar').addClass('bg-white/95 shadow-lg');
            } else {
                $('#navbar').removeClass('bg-white/95 shadow-lg');
            }
            lastScrollTop = scrollTop;
        }
    });

    // Optimized Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Use requestAnimationFrame for smooth class addition
                requestAnimationFrame(() => {
                    entry.target.classList.add('visible');
                });
            }
        });
    }, observerOptions);

    // Observe all animated elements
    $('.fade-in, .slide-in-left, .slide-in-right, .scale-in').each(function() {
        observer.observe(this);
    });

    // Optimized parallax effect
    let parallaxElements = $('.hero-pattern');
    $(window).on('scroll', function() {
        requestTick();
        const scrolled = $(window).scrollTop();
        const speed = scrolled * 0.3; // Reduced speed for smoother effect
        
        parallaxElements.css('transform', `translateY(${speed}px)`);
    });

    // Optimized animated counter
    function animateCounter(element, target) {
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            element.text(current);
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Trigger counter animation when in view
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter($(entry.target), target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    $('.text-3xl.font-bold.text-amber-600').each(function() {
        counterObserver.observe(this);
    });

    // Optimized hover effects for service cards
    $('.scale-in').hover(
        function() {
            $(this).addClass('transform scale-105');
        },
        function() {
            $(this).removeClass('transform scale-105');
        }
    );

    // Form submission with animation
    $('form').on('submit', function(e) {
        e.preventDefault();
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.text();
        
        submitBtn.text('Sending...').prop('disabled', true);
        
        setTimeout(() => {
            submitBtn.text('Message Sent!').addClass('bg-green-500');
            setTimeout(() => {
                submitBtn.text(originalText).removeClass('bg-green-500').prop('disabled', false);
                this.reset();
            }, 2000);
        }, 1500);
    });

    // Optimized floating elements animation
    let floatingElements = [];
    function createFloatingElement() {
        if (floatingElements.length > 5) return; // Limit number of elements
        
        const colors = ['amber-200', 'orange-200', 'yellow-200'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 60 + 20;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 3 + 2;
        
        const element = $(`<div class="absolute w-${Math.floor(size)} h-${Math.floor(size)} bg-${color}/30 rounded-full floating" style="left: ${left}%; animation-duration: ${animationDuration}s;"></div>`);
        
        $('.gradient-bg').append(element);
        floatingElements.push(element);
        
        setTimeout(() => {
            element.remove();
            floatingElements = floatingElements.filter(el => el[0] !== element[0]);
        }, animationDuration * 1000);
    }

    // Create floating elements less frequently
    setInterval(createFloatingElement, 4000);

    // Optimized typing animation
    function typeWriter(element, text, speed = 80) {
        let i = 0;
        element.text('');
        
        function type() {
            if (i < text.length) {
                element.text(element.text() + text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Trigger typing animation when hero section is in view
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const titleElement = entry.target.querySelector('h1');
                if (titleElement && !titleElement.dataset.typed) {
                    const originalText = titleElement.textContent;
                    titleElement.dataset.typed = 'true';
                    typeWriter($(titleElement), originalText, 60);
                }
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const homeSection = document.getElementById('home');
    if (homeSection) {
        heroObserver.observe(homeSection);
    }

    // Optimized image hover effects
    $('img').hover(
        function() {
            $(this).addClass('transform scale-105 transition-transform duration-300');
        },
        function() {
            $(this).removeClass('transform scale-105');
        }
    );

    // Optimized particle effect
    let particles = [];
    function createParticle() {
        if (particles.length > 20) return; // Limit particles
        
        const particle = $('<div class="absolute w-2 h-2 bg-amber-400/50 rounded-full"></div>');
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        const endX = startX + (Math.random() - 0.5) * 200;
        const endY = -10;
        const duration = Math.random() * 3000 + 2000;

        particle.css({
            left: startX + 'px',
            top: startY + 'px'
        });

        $('.gradient-bg').append(particle);
        particles.push(particle);

        particle.animate({
            left: endX + 'px',
            top: endY + 'px',
            opacity: 0
        }, duration, 'linear', function() {
            particle.remove();
            particles = particles.filter(p => p[0] !== particle[0]);
        });
    }

    // Create particles less frequently
    setInterval(createParticle, 800);

    // Optimized magnetic effect for buttons
    $('button').on('mousemove', function(e) {
        const $this = $(this);
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
        
        $this.css('transform', `translate(${x}px, ${y}px)`);
    });

    $('button').on('mouseleave', function() {
        $(this).css('transform', 'translate(0px, 0px)');
    });

    // Optimized loading animation
    $(window).on('load', function() {
        $('body').addClass('loaded');
        $('.loading-screen').fadeOut(800);
    });

    // Add loading screen
    $('body').prepend('<div class="loading-screen fixed inset-0 bg-white z-50 flex items-center justify-center"><div class="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div></div>');

    // Optimized cursor trail effect
    let mouseX = 0, mouseY = 0;
    let trail = [];
    let trailElements = [];

    $(document).on('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateTrail() {
        trail.push({ x: mouseX, y: mouseY });
        if (trail.length > 8) { // Reduced trail length
            trail.shift();
        }

        trail.forEach((pos, index) => {
            const opacity = (index / trail.length) * 0.2; // Reduced opacity
            const size = (index / trail.length) * 6 + 2; // Reduced size
            
            if (!trailElements[index]) {
                trailElements[index] = $('<div class="fixed pointer-events-none rounded-full bg-amber-400 z-40"></div>');
                $('body').append(trailElements[index]);
            }
            
            trailElements[index].css({
                left: pos.x - size/2 + 'px',
                top: pos.y - size/2 + 'px',
                width: size + 'px',
                height: size + 'px',
                opacity: opacity
            });
        });
    }

    // Update trail less frequently
    setInterval(updateTrail, 32); // 30 FPS instead of 60 FPS

    // Initialize tooltips
    $('[data-tooltip]').hover(
        function() {
            const tooltip = $('<div class="absolute bg-gray-800 text-white px-2 py-1 rounded text-sm z-50"></div>');
            tooltip.text($(this).data('tooltip'));
            $('body').append(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.css({
                left: rect.left + rect.width/2 - tooltip.width()/2 + 'px',
                top: rect.top - tooltip.height() - 10 + 'px'
            });
            
            $(this).data('tooltip-element', tooltip);
        },
        function() {
            $(this).data('tooltip-element').remove();
        }
    );

    // Add smooth scrolling polyfill for better performance
    if (!('scrollBehavior' in document.documentElement.style)) {
        // Polyfill for browsers that don't support smooth scrolling
        $('html').css('scroll-behavior', 'smooth');
    }

    console.log('Artisan Ceramics website loaded successfully! 🏺');
}); 