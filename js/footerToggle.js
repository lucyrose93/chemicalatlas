let lastScrollY = window.scrollY;
const footer = document.querySelector('footer');

window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY && window.scrollY > 100) {
    footer.classList.add('show');
  } else {
    footer.classList.remove('show');
  }
  lastScrollY = window.scrollY;
});