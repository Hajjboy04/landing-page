// ==========================================================================
// OLTEP ERP - CLIENT INTERACTION SCRIPT
// Handles scroll fading, header squeeze, navigation, accordions & form
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------------------------
    // 1. DOM Elements
    // ----------------------------------------------------------------------
    const header = document.getElementById('main-header');
    const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');
    const whatsappFloat = document.querySelector('.whatsapp-float');

    // Initial check for Header squeeze and Scroll-to-Top button
    const initialScrollY = window.pageYOffset || document.documentElement.scrollTop;
    if (header) {
        if (initialScrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    if (scrollToTopBtn && initialScrollY > 350) {
        scrollToTopBtn.classList.add('show');
    }

    // ----------------------------------------------------------------------
    // 2. Scroll Animation Between Sections (Intersection Observer)
    // ----------------------------------------------------------------------
    const fadeElements = document.querySelectorAll('.scroll-fade');

    if ('IntersectionObserver' in window && fadeElements.length > 0) {
        const fadeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                } else {
                    entry.target.classList.remove('is-visible');
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -50px 0px'
        });

        fadeElements.forEach(el => fadeObserver.observe(el));
    } else {
        // Fallback for environments without IntersectionObserver
        fadeElements.forEach(el => el.classList.add('is-visible'));
    }

    // ----------------------------------------------------------------------
    // 2.5 Hero Section: Dynamic Background Slideshow (Auto-Transition)
    // ----------------------------------------------------------------------
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');

    if (heroSlides.length > 1) {
        let currentHeroSlide = 0;
        let heroSlideTimer = null;
        const HERO_SLIDE_DURATION = 4600; // 4.6 seconds per background image

        function setHeroSlide(index) {
            currentHeroSlide = (index + heroSlides.length) % heroSlides.length;

            heroSlides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentHeroSlide);
            });

            heroDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentHeroSlide);
            });
        }

        function startHeroSlideTimer() {
            stopHeroSlideTimer();
            heroSlideTimer = setInterval(() => {
                setHeroSlide(currentHeroSlide + 1);
            }, HERO_SLIDE_DURATION);
        }

        function stopHeroSlideTimer() {
            if (heroSlideTimer) {
                clearInterval(heroSlideTimer);
                heroSlideTimer = null;
            }
        }

        // Start dynamic rotation
        startHeroSlideTimer();

        // Allow clicking indicator dots to navigate directly
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                setHeroSlide(index);
                startHeroSlideTimer(); // Reset rotation timer
            });
        });

        // Pause slideshow when user interacts with hero controls, resume on leave
        const heroSection = document.querySelector('.hero-section');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => stopHeroSlideTimer());
            heroSection.addEventListener('mouseleave', () => startHeroSlideTimer());
        }
    }

    // ----------------------------------------------------------------------
    // 3. Header Squeeze on Scroll & Scroll-To-Top Button
    // ----------------------------------------------------------------------
    let isTicking = false;

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.pageYOffset || document.documentElement.scrollTop;

                // Squeeze Nav Bar
                if (header) {
                    if (scrollY > 30) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                }

                // Show / Hide Floating Scroll To Top Button
                if (scrollToTopBtn) {
                    if (scrollY > 350) {
                        scrollToTopBtn.classList.add('show');
                    } else {
                        scrollToTopBtn.classList.remove('show');
                    }
                }

                // Update Active Navigation Link Based on Scroll Position
                updateActiveNavLink(scrollY);

                isTicking = false;
            });
            isTicking = true;
        }
    }, { passive: true });

    // ----------------------------------------------------------------------
    // 4. Scroll To Top Click Action
    // ----------------------------------------------------------------------
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. Active Nav Link Tracking
    // ----------------------------------------------------------------------
    const trackedSections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links .nav-link, .mobile-menu .nav-link');

    function updateActiveNavLink(currentScrollY) {
        let currentSectionId = '';

        trackedSections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (currentScrollY >= sectionTop && currentScrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentScrollY < 150) {
            navLinks.forEach(link => {
                if (link.getAttribute('href') === '#') {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        } else if (currentSectionId) {
            // Map module sub-sections to the 'About' nav link
            const targetId = currentSectionId.startsWith('module-') ? 'about' : currentSectionId;
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href === `#${targetId}`) {
                    link.classList.add('active');
                } else if (href !== '#') {
                    link.classList.remove('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 6. Mobile Menu Toggle
    // ----------------------------------------------------------------------
    if (mobileToggleBtn && mobileMenu) {
        mobileToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.toggle('open');
            mobileToggleBtn.setAttribute('aria-expanded', isOpen);

            const icon = mobileToggleBtn.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close Mobile Menu on Click of any menu link
        document.querySelectorAll('.mobile-menu .nav-link, .mobile-menu .btn-demo').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                mobileToggleBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });

        // Close Mobile Menu on Outside Tap
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
                mobileMenu.classList.remove('open');
                mobileToggleBtn.setAttribute('aria-expanded', 'false');
                const icon = mobileToggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ----------------------------------------------------------------------
    // 7. Contact Form Submission & Validation
    // ----------------------------------------------------------------------
    if (contactForm && formMessage) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !subject || !message) {
                formMessage.textContent = 'Please fill in all fields.';
                formMessage.className = 'error';
                return;
            }

            // Simple email validation pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formMessage.textContent = 'Please enter a valid email address.';
                formMessage.className = 'error';
                return;
            }

            formMessage.textContent = 'Thank you! Your message has been received.';
            formMessage.className = 'success';
            contactForm.reset();

            // Clear success message after 5 seconds
            setTimeout(() => {
                formMessage.textContent = '';
                formMessage.className = '';
            }, 5000);
        });
    }
    // ----------------------------------------------------------------------
    // 8. Features Section: Auto-Cycling Slide & Fade + Hover/Touch Controls
    // ----------------------------------------------------------------------
    const featuresSection = document.getElementById('features');
    const featuresGrid = document.querySelector('.features-grid');
    const featureCards = Array.from(document.querySelectorAll('.feature-card'));

    if (featuresSection && featureCards.length > 0) {
        let currentActiveIndex = 0;
        let autoCycleTimer = null;
        let isUserInteracting = false;
        let resumeTimeout = null;
        let isSectionInView = false;

        function setActiveCard(index) {
            featureCards.forEach((card, idx) => {
                if (idx === index) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });
            currentActiveIndex = index;
        }

        function clearAllActive() {
            featureCards.forEach(card => card.classList.remove('active'));
        }

        function nextCard() {
            if (isUserInteracting) return;
            const nextIndex = (currentActiveIndex + 1) % featureCards.length;
            setActiveCard(nextIndex);
        }

        function startAutoCycle() {
            stopAutoCycle();
            if (isUserInteracting || !isSectionInView) return;
            // Ensure an active card is set when cycling begins
            const hasActive = featureCards.some(c => c.classList.contains('active'));
            if (!hasActive) {
                setActiveCard(currentActiveIndex);
            }
            autoCycleTimer = setInterval(nextCard, 3500);
        }

        function stopAutoCycle() {
            if (autoCycleTimer) {
                clearInterval(autoCycleTimer);
                autoCycleTimer = null;
            }
        }

        function scheduleResume(delay = 1500) {
            clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                isUserInteracting = false;
                startAutoCycle();
            }, delay);
        }

        // Hover & Interaction listeners
        featureCards.forEach((card, idx) => {
            // Mouse Enter: Pause auto-cycle and focus hovered card
            card.addEventListener('mouseenter', () => {
                isUserInteracting = true;
                stopAutoCycle();
                clearTimeout(resumeTimeout);
                setActiveCard(idx);
            });

            // Touch interaction for mobile/tablets
            card.addEventListener('click', (e) => {
                // Allow direct link navigation if clicking drawer action
                if (e.target.closest('.drawer-action')) return;

                if (window.innerWidth <= 992) {
                    isUserInteracting = true;
                    stopAutoCycle();
                    clearTimeout(resumeTimeout);

                    const wasActive = card.classList.contains('active');
                    clearAllActive();
                    if (!wasActive) {
                        card.classList.add('active');
                        currentActiveIndex = idx;
                    }
                    scheduleResume(5000);
                }
            });
        });

        // Mouse Leave on grid: smoothly resume auto-cycling after brief delay
        if (featuresGrid) {
            featuresGrid.addEventListener('mouseleave', () => {
                scheduleResume(1400);
            });
        }

        // Tap outside on mobile resets and resumes auto-cycle
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.feature-card')) {
                if (window.innerWidth <= 992 && isUserInteracting) {
                    clearAllActive();
                    scheduleResume(1000);
                }
            }
        });

        // IntersectionObserver: Cycle only when features section is visible in viewport
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            isSectionInView = true;
                            startAutoCycle();
                        } else {
                            isSectionInView = false;
                            stopAutoCycle();
                        }
                    });
                },
                { threshold: 0.15 }
            );
            observer.observe(featuresSection);
        } else {
            isSectionInView = true;
            startAutoCycle();
        }
    }
});