document.addEventListener("DOMContentLoaded", function() {
  document.body.classList.add('fade-in');

  const leftArrow = document.querySelector(".left-arrow");
  const rightArrow = document.querySelector(".right-arrow");
  const projectsContainer = document.querySelector(".projects-container");
  const header = document.querySelector('header');

  function smoothScroll(container, direction, amount, duration) {
      let start = null;
      const step = amount / (duration / 16.67); // Calculate the step size based on 60fps

      function scroll(timestamp) {
          if (!start) start = timestamp;
          const progress = timestamp - start;
          container.scrollBy({
              left: direction * step, // Scroll left or right
              behavior: 'auto' // Disable smooth behavior for precise control
          });
          if (progress < duration) {
              window.requestAnimationFrame(scroll);
          }
      }

      window.requestAnimationFrame(scroll);
  }

  leftArrow.addEventListener("click", () => {
      smoothScroll(projectsContainer, -1, 300, 1000); // Adjust scroll amount and duration as needed
  });

  rightArrow.addEventListener("click", () => {
      smoothScroll(projectsContainer, 1, 300, 1000); // Adjust scroll amount and duration as needed
  });

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-list a');

  navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
          e.preventDefault();

          const targetId = link.getAttribute('href').substring(1); // Remove the '#'
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
              targetElement.scrollIntoView({
                  behavior: 'smooth'
              });
          }
      });
  });

  // Function to sample color directly under the header
  function sampleColorUnderHeader() {
      const header = document.querySelector('header');
      const headerRect = header.getBoundingClientRect();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = headerRect.width;
      canvas.height = headerRect.height;

      // Draw only the area under the header into the canvas
      ctx.drawImage(document.documentElement, headerRect.left, headerRect.top, headerRect.width, headerRect.height, 0, 0, headerRect.width, headerRect.height);

      const pixelData = ctx.getImageData(0, 0, 1, 1).data;
      return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
  }

  // Adjust header text color based on sampled background color
  function adjustHeaderTextColor() {
      const sampledColor = sampleColorUnderHeader();
      const luminance = calculateLuminance(sampledColor);

      if (luminance > 0.5) {
          header.style.color = '#000'; // Dark text for light background
      } else {
          header.style.color = '#fff'; // Light text for dark background
      }
  }

  // Calculate luminance of a color
  function calculateLuminance(rgbColor) {
      const [r, g, b] = rgbColor.match(/\d+/g).map(Number);
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  }

  // Initially adjust text color based on the background
  adjustHeaderTextColor();

  // Adjust text color on scroll or window resize events
  window.addEventListener('scroll', adjustHeaderTextColor);
  window.addEventListener('resize', adjustHeaderTextColor);
});
