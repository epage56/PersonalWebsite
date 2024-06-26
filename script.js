const navLinks = document.querySelectorAll('nav a');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const sectionId = event.target.hash;
    document.querySelector(sectionId).scrollIntoView();
  });
});
