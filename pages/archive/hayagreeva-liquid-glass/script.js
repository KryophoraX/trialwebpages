(function () {
  const orbs = document.querySelectorAll(".glass-orb");
  if (!orbs.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  let raf = 0;
  let mx = 0;
  let my = 0;

  window.addEventListener(
    "pointermove",
    (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          orbs.forEach((orb, i) => {
            const depth = (i + 1) * 6;
            orb.style.translate = `${mx * depth}px ${my * depth}px`;
          });
          raf = 0;
        });
      }
    },
    { passive: true }
  );
})();
