(() => {
  const body = document.body;
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const onScroll = () => {
    const threshold = hero.offsetHeight * 0.55;
    body.classList.toggle("is-scrolled", window.scrollY > threshold);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const reveal = document.querySelectorAll(
    ".mission, .product, .specs, .path, .cta, .feature"
  );

  reveal.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );

  reveal.forEach((el) => io.observe(el));
})();
