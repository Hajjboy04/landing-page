// DOM Elements for top nav and  features
const header = document.getElementById('main-header');
const mobileToggleBtn = document.getElementById('mobile-toggle-btn');
const mobileMenu = document.getElementById('mobile-menu');

// Toggle Horizontal Accordion Card Active State on Tap/Click
function toggleAccordion(element) {
    document.querySelectorAll('.accordion-card').forEach(card => {
        if (card !== element) card.classList.remove('active');
    });
    element.classList.toggle('active');
}

// Squeeze Navigation Bar on Scroll
window.addEventListener('scroll', () => {
    if (header && window.scrollY > 30) {
        header.classList.add('scrolled');
    } else if (header) {
        header.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle with Defensive Null Checks
if (mobileToggleBtn && mobileMenu) {
    mobileToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('open');
        const icon = mobileToggleBtn.querySelector('i');
        if (icon) {
            if (mobileMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close Mobile Menu on Link Click
    document.querySelectorAll('.mobile-menu .nav-link, .mobile-menu .btn-demo').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
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
            const icon = mobileToggleBtn.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });
}