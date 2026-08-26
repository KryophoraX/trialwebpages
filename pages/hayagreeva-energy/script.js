(function () {
  const rotatorWords = [
    "GPUs.",
    "CPUs.",
    "Accelerators.",
    "AI Racks.",
    "HPC Systems.",
  ];

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
  const sections = Array.from(document.querySelectorAll("section[data-section]"));
  const dots = Array.from(document.querySelectorAll(".nav-dot"));

  function setActiveDot(name) {
    dots.forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.target === name);
    });
  }

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const target = document.querySelector(`section[name="${dot.dataset.target}"]`);
      if (target && root) {
        root.scrollTo({ top: target.offsetTop, behavior: "smooth" });
      }
    });
  });

  if ("IntersectionObserver" in window && root) {
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

  const video = document.querySelector(".hero-bg video");
  if (video) {
    video.play().catch(() => {
      video.remove();
    });
  }
})();
