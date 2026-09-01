(() => {
  const rotatorWords = ["GPUs.", "CPUs.", "Accelerators.", "AI Racks.", "HPC Systems."];
  const rotatorEl = document.getElementById("rotator-word");
  let rotatorIndex = 0;

  function cycleRotator() {
    if (!rotatorEl) return;
    rotatorEl.classList.add("fade");
    setTimeout(() => {
      rotatorIndex = (rotatorIndex + 1) % rotatorWords.length;
      rotatorEl.textContent = rotatorWords[rotatorIndex];
      rotatorEl.classList.remove("fade");
    }, 350);
  }

  setInterval(cycleRotator, 2800);

  const root = document.getElementById("snap-root");
  if (!root) return;

  const sections = Array.from(document.querySelectorAll("section[data-section]"));
  const dots = Array.from(document.querySelectorAll(".nav-dot"));

  function setActiveDot(name) {
    dots.forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.target === name);
    });
  }

  function scrollToSection(name) {
    const target = document.querySelector(`section[name="${name}"]`);
    if (target && root) {
      root.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => scrollToSection(dot.dataset.target));
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute("href").slice(1);
    if (!id || !document.querySelector(`section[name="${id}"]`)) return;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      scrollToSection(id);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const name = visible.target.getAttribute("name");
          if (name) setActiveDot(name);
        }
      },
      { root, threshold: [0.35, 0.55, 0.75] }
    );
    sections.forEach((section) => observer.observe(section));
  }

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const textSlides = Array.from(hero.querySelectorAll(".hero-text-slide"));
  const visualSlides = Array.from(hero.querySelectorAll(".hero-slide"));
  const heroDots = Array.from(hero.querySelectorAll(".hero-dot"));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let index = 0;
  let timer = null;
  const INTERVAL = 6500;

  function setHeroSlide(next) {
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
      const video = slide.querySelector("video");
      if (video) {
        if (active) video.play().catch(() => {});
        else video.pause();
      }
    });

    heroDots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
    });
  }

  function startAutoplay() {
    if (reduced) return;
    clearInterval(timer);
    timer = setInterval(() => setHeroSlide(index + 1), INTERVAL);
  }

  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setHeroSlide(Number(dot.dataset.slide));
      startAutoplay();
    });
  });

  hero.addEventListener("mouseenter", () => clearInterval(timer));
  hero.addEventListener("mouseleave", startAutoplay);

  setHeroSlide(0);
  startAutoplay();

  const firstVideo = hero.querySelector("video");
  if (firstVideo) {
    firstVideo.play().catch(() => firstVideo.remove());
  }
})();
