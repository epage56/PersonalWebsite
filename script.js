document.addEventListener("DOMContentLoaded", function() {
    document.body.classList.add('fade-in');
    const projectsSection = document.getElementById('projects-section');
    const projectsContainer = document.querySelector(".projects-container");
    const header = document.querySelector('header');
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const projectCards = document.querySelectorAll('.project-card');
    let isProjectsSectionActive = false;

    console.log('Projects container scrollWidth:', projectsContainer.scrollWidth);
    console.log('Projects container clientWidth:', projectsContainer.clientWidth);

    const lenis = new Lenis({
        duration: 0.6,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 2,
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
        if (!projectsContainer) {
            console.error('projectsContainer not found');
            return { reachedEnd: false, reachedStart: false };
        }

        const scrollLeft = projectsContainer.scrollLeft;
        const maxScroll = projectsContainer.scrollWidth - projectsContainer.clientWidth;

        let newScrollLeft = scrollLeft + amount;
        newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));

        projectsContainer.scrollTo({
            left: newScrollLeft,
            behavior: 'smooth'
        });

        const reachedEnd = newScrollLeft >= maxScroll - 1;
        const reachedStart = newScrollLeft <= 1;

        return { reachedEnd, reachedStart };
    }

    window.addEventListener('wheel', (e) => {
        const projectsSectionRect = projectsSection.getBoundingClientRect();
        const isProjectsSectionVisible = projectsSectionRect.top <= 0 && projectsSectionRect.bottom > window.innerHeight;

        if (isProjectsSectionVisible) {
            if (!isProjectsSectionActive) {
                isProjectsSectionActive = true;
                lenis.stop();
            }

            e.preventDefault();
            const scrollAmount = e.deltaY;
            const { reachedEnd, reachedStart } = smoothHorizontalScroll(scrollAmount);

            if ((reachedEnd && scrollAmount > 0) || (reachedStart && scrollAmount < 0)) {
                isProjectsSectionActive = false;
                lenis.start();
            }
        } else if (isProjectsSectionActive) {
            isProjectsSectionActive = false;
            lenis.start();
        }
    }, { passive: false });

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

    leftArrow.addEventListener('click', () => smoothHorizontalScroll(-300));
    rightArrow.addEventListener('click', () => smoothHorizontalScroll(300));

    document.querySelectorAll('.nav-list a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            lenis.scrollTo(targetElement);
        });
    });
});