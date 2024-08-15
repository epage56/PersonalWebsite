document.addEventListener("DOMContentLoaded", function () {
  document.body.classList.add("fade-in");
  const projectsSection = document.getElementById("projects-section");
  const projectsContainer = document.querySelector(".projects-container");
  const projectCards = document.querySelectorAll(".project-card");

  let isProjectsSectionActive = false;
  let lastScrollTop = 0;

  const lenis = new Lenis({
    duration: 0.6,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
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

  document.querySelectorAll(".project-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const destination = this.href;
      document.body.classList.remove("fade-in");
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    });
  });

  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      lenis.scrollTo(targetElement);
    });
  });

  document.querySelectorAll(".branding a").forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const destination = this.href;
      document.body.classList.remove("fade-in");
      setTimeout(() => {
        window.location.href = destination;
      }, 500);
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    document
      .getElementById("lets-chat-link")
      .addEventListener("click", function (e) {
        e.preventDefault(); // Prevent the default anchor behavior

        // Replace 'your-linkedin-profile-id' with your actual LinkedIn profile ID
        window.open(
          "https://www.linkedin.com/messaging/compose/elipage",
          "_blank",
        );
      });
  });
});
