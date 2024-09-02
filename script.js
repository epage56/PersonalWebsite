document.addEventListener("DOMContentLoaded", function () {
  // Fade-in effect
  document.body.classList.add("fade-in");

  // Cache frequently accessed elements
  const projectsSection = document.getElementById("projects-section");
  const projectsContainer = document.querySelector(".projects-container");
  const letsChatLink = document.getElementById("lets-chat-link");

  let isProjectsSectionActive = false;
  let lastScrollTop = 0;

  // Initialize Lenis for smooth scrolling
  const lenis = new Lenis({
    duration: 0.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  console.log("Lenis instance:", lenis);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  function smoothHorizontalScroll(amount) {
    if (!projectsContainer) {
      console.error("projectsContainer not found");
      return { reachedEnd: false, reachedStart: false };
    }

    const scrollLeft = projectsContainer.scrollLeft;
    const maxScroll =
      projectsContainer.scrollWidth - projectsContainer.clientWidth;

    let newScrollLeft = scrollLeft + amount;
    newScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));

    projectsContainer.scrollLeft = newScrollLeft;

    const reachedEnd = newScrollLeft >= maxScroll - 1;
    const reachedStart = newScrollLeft <= 1;

    return { reachedEnd, reachedStart };
  }

  function isProjectsSectionInView() {
    const rect = projectsSection.getBoundingClientRect();
    return rect.top <= 0 && rect.bottom > window.innerHeight;
  }

  window.addEventListener("scroll", function () {
    const currentScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    if (isProjectsSectionInView()) {
      if (!isProjectsSectionActive) {
        isProjectsSectionActive = true;
        lenis.stop();
        lastScrollTop = currentScrollTop;
        window.scrollTo(0, lastScrollTop);
      }
    } else if (isProjectsSectionActive) {
      isProjectsSectionActive = false;
      lenis.start();
    }
  });

  window.addEventListener(
    "wheel",
    function (e) {
      if (isProjectsSectionActive) {
        e.preventDefault();
        const { reachedEnd, reachedStart } = smoothHorizontalScroll(e.deltaY);

        if ((reachedEnd && e.deltaY > 0) || (reachedStart && e.deltaY < 0)) {
          isProjectsSectionActive = false;
          lenis.start();
        }
      }
    },
    { passive: false },
  );

  // Fade-out effect for project links
  document.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const destination = this.href;
      document.body.classList.remove("fade-in");
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    });
  });

  // Smooth scroll for navigation links
  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      lenis.scrollTo(targetElement);
    });
  });

  // Fade-out effect for branding links
  document.querySelectorAll(".branding a").forEach((link) => {
    link.addEventListener("click", function (e) {
      const destination = this.href;
      document.body.classList.remove("fade-in");
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    });
  });
});
