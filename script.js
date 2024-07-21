<script src="https://unpkg.com/lenis@1.1.5/dist/lenis.min.js"></script> 

document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('fade-in');
    const projectsSection = document.getElementById('projects-section');
    const projectsContainer = document.querySelector(".projects-container");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    if (!projectsContainer) {
        console.error('Projects container not found');
        return;
    }

    const lenis = new Lenis({
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    let reachedEnd = false;

    function smoothHorizontalScroll(amount) {
        console.log('smoothHorizontalScroll called with amount:', amount);

        const scrollLeft = projectsContainer.scrollLeft;
        const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth;

        console.log('Current scroll state:', { scrollLeft, maxScroll });

        const newScrollLeft = Math.max(0, Math.min(scrollLeft + amount, maxScroll));

        console.log('Attempting to scroll to:', newScrollLeft);

        projectsContainer.scrollLeft = newScrollLeft;
        console.log('New scrollLeft immediately after setting:', projectsContainer.scrollLeft);

        reachedEnd = newScrollLeft === maxScroll && amount > 0;

        console.log('Scroll result:', { newScrollLeft, reachedEnd });

        return reachedEnd;
    }

    window.addEventListener('wheel', (e) => {
        const projectsSectionRect = projectsSection.getBoundingClientRect();
        const isProjectsSectionVisible = projectsSectionRect.top <= 0 && projectsSectionRect.bottom > 0;

        console.log('Wheel event:', { isProjectsSectionVisible });

        if (isProjectsSectionVisible && !reachedEnd) {
            lenis.stop();

            const scrollAmount = e.deltaY;
            console.log('Attempting horizontal scroll:', scrollAmount);
            reachedEnd = smoothHorizontalScroll(scrollAmount);
            console.log('Horizontal scroll result:', { reachedEnd });

        } else {
            lenis.start();
        }
    }, { passive: false });

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
