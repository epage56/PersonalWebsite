document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('fade-in');
    const projectsSection = document.getElementById('projects-section');
    const projectsContainer = document.querySelector(".projects-container");
    const header = document.querySelector('header');
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const projectCards = document.querySelectorAll('.project-card');

    let isProjectsSectionActive = false;
    let lastScrollTop = 0;

    const lenis = new Lenis({
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    function smoothHorizontalScroll(amount) {
        const scrollLeft = projectsContainer.scrollLeft;
        const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth;
        
        projectsContainer.scrollTo({
            left: Math.max(0, Math.min(scrollLeft + amount, maxScroll)),
            behavior: 'smooth'
        });
    }

    function isProjectsContainerAtEnd() {
        return Math.abs(projectsContainer.scrollLeft + projectsContainer.clientWidth - projectsContainer.scrollWidth) < 1;
    }

    function isProjectsContainerAtStart() {
        return projectsContainer.scrollLeft <= 0;
    }

    window.addEventListener('scroll', () => {
        const projectsSectionTop = projectsSection.getBoundingClientRect().top;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
        if (projectsSectionTop <= 0 && scrollTop > lastScrollTop) {
            isProjectsSectionActive = true;
            lenis.stop();
        } else if (scrollTop < lastScrollTop && isProjectsSectionActive && isProjectsContainerAtStart()) {
            isProjectsSectionActive = false;
            lenis.start();
        }
    
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
    
    window.addEventListener('wheel', (e) => {
        const projectsSectionRect = projectsSection.getBoundingClientRect();
        if (projectsSectionRect.top <= 0 && projectsSectionRect.bottom > window.innerHeight) {
            e.preventDefault();
            isProjectsSectionActive = true;
            lenis.stop();
            
            // Translate vertical scroll to horizontal
            const scrollAmount = e.deltaY;
            smoothHorizontalScroll(scrollAmount);
    
            // Check if we've reached the end of horizontal scrolling
            if (isProjectsContainerAtEnd() && scrollAmount > 0) {
                isProjectsSectionActive = false;
                lenis.start();
            }
        } else if (isProjectsSectionActive && projectsSectionRect.top > 0) {
            isProjectsSectionActive = false;
            lenis.start();
        }
    }, { passive: false });

    // Touch events for mobile devices
    let touchStartX;
    let touchStartY;
    projectsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    projectsContainer.addEventListener('touchmove', (e) => {
        if (isProjectsSectionActive) {
            e.preventDefault();
            const touchEndX = e.touches[0].clientX;
            const touchEndY = e.touches[0].clientY;
            const deltaX = touchStartX - touchEndX;
            const deltaY = touchStartY - touchEndY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                smoothHorizontalScroll(deltaX);
            }

            touchStartX = touchEndX;
            touchStartY = touchEndY;
        }
    }, { passive: false });

    leftArrow.addEventListener("click", () => smoothHorizontalScroll(-300));
    rightArrow.addEventListener("click", () => smoothHorizontalScroll(300));

    // New code for project card navigation

    document.querySelectorAll('.project-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = this.href;
            document.body.classList.remove('fade-in');
            setTimeout(() => {
                window.location.href = destination;
            }, 500);
        });
    });
});