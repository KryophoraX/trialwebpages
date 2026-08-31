(() => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const textSlides = Array.from(hero.querySelectorAll(".hero-text-slide"));
  const visualSlides = Array.from(hero.querySelectorAll(".hero-visual-slide"));
  const dots = Array.from(hero.querySelectorAll(".hero-dot"));
  const prevBtn = hero.querySelector(".hero-arrow--prev");
  const nextBtn = hero.querySelector(".hero-arrow--next");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  const INTERVAL = 6500;

  function setSlide(next) {
    index = (next + textSlides.length) % textSlides.length;

    textSlides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
    });

    visualSlides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.hidden = !active;
    });

    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
    });
  }

  function next() {
    setSlide(index + 1);
  }

  function prev() {
    setSlide(index - 1);
  }

  function startAutoplay() {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setSlide(Number(dot.dataset.slide));
      startAutoplay();
    });
  });

  prevBtn?.addEventListener("click", () => {
    prev();
    startAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    next();
    startAutoplay();
  });

  hero.addEventListener("mouseenter", () => clearInterval(timer));
  hero.addEventListener("mouseleave", startAutoplay);

  setSlide(0);
  startAutoplay();
})();
