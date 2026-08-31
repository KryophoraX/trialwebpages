(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Loader ── */
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loaderBar");
  const pct = document.getElementById("loaderPct");
  const phase = document.querySelector(".ld-phase-text");
  const phases = ["Initialising", "Cooling loop", "Mapping flux", "Ready"];
  let p = 0;
  let phaseIdx = 0;

  function tickLoader() {
    p = Math.min(100, p + (reduce ? 20 : 2 + Math.random() * 4));
    if (bar) bar.style.width = p + "%";
    if (pct) pct.textContent = Math.floor(p) + "%";
    const nextPhase = Math.min(phases.length - 1, Math.floor(p / 28));
    if (phase && nextPhase !== phaseIdx) {
      phaseIdx = nextPhase;
      phase.textContent = phases[phaseIdx];
    }
    if (p < 100) {
      requestAnimationFrame(tickLoader);
    } else {
      document.body.classList.remove("has-loader");
      document.body.classList.add("is-scroll-ready", "is-day");
      if (loader) {
        loader.classList.add("is-out");
        setTimeout(() => loader.remove(), 800);
      }
    }
  }

  requestAnimationFrame(tickLoader);

  /* ── Stars ── */
  const stars = document.getElementById("stars");
  const sctx = stars && stars.getContext("2d");
  let starPts = [];

  function resizeStars() {
    if (!stars || !sctx) return;
    stars.width = window.innerWidth;
    stars.height = window.innerHeight;
    starPts = Array.from({ length: 120 }, () => ({
      x: Math.random() * stars.width,
      y: Math.random() * stars.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random() * 0.7 + 0.15,
    }));
  }

  function drawStars() {
    if (!sctx || !stars) return;
    sctx.clearRect(0, 0, stars.width, stars.height);
    for (const s of starPts) {
      sctx.beginPath();
      sctx.fillStyle = `rgba(186,230,253,${s.a})`;
      sctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sctx.fill();
    }
  }

  resizeStars();
  drawStars();
  window.addEventListener("resize", () => {
    resizeStars();
    drawStars();
  });

  /* ── Day / night on scroll ── */
  const prog = document.getElementById("scrollProg");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? window.scrollY / max : 0;
    if (prog) prog.style.width = `${t * 100}%`;
    document.body.classList.toggle("is-day", t < 0.12);
    document.body.classList.toggle("is-night", t >= 0.12);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ── Orb dots globe ── */
  const canvas = document.getElementById("orbDots");
  const orb = document.getElementById("orb");
  const ctx = canvas && canvas.getContext("2d");
  let rotY = 0;
  let rotX = 0.15;
  let velY = 0.004;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  const dots = [];
  const N = 28;
  for (let i = 0; i < N; i++) {
    const lat = Math.PI * (i / (N - 1) - 0.5);
    const count = Math.max(6, Math.floor(Math.cos(lat) * 36));
    for (let j = 0; j < count; j++) {
      const lon = (j / count) * Math.PI * 2;
      dots.push({
        x: Math.cos(lat) * Math.cos(lon),
        y: Math.sin(lat),
        z: Math.cos(lat) * Math.sin(lon),
      });
    }
  }

  function drawOrb() {
    if (!ctx || !canvas) return;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const R = w * 0.38;
    ctx.clearRect(0, 0, w, h);

    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);

    const projected = dots.map((d) => {
      let x = d.x * cosY - d.z * sinY;
      let z = d.x * sinY + d.z * cosY;
      let y = d.y * cosX - z * sinX;
      z = d.y * sinX + z * cosX;
      return { x, y, z };
    });

    projected.sort((a, b) => a.z - b.z);

    for (const p of projected) {
      if (p.z < -0.05) continue;
      const px = cx + p.x * R;
      const py = cy + p.y * R;
      const depth = (p.z + 1) / 2;
      const r = 1.1 + depth * 1.8;
      ctx.beginPath();
      ctx.fillStyle = `rgba(186, 230, 253, ${0.15 + depth * 0.75})`;
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!dragging && !reduce) rotY += velY;
    requestAnimationFrame(drawOrb);
  }

  if (canvas) {
    drawOrb();

    function pointerDown(e) {
      dragging = true;
      orb.classList.add("is-touched");
      lastX = e.clientX ?? e.touches?.[0]?.clientX;
      lastY = e.clientY ?? e.touches?.[0]?.clientY;
    }

    function pointerMove(e) {
      if (!dragging) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX;
      const y = e.clientY ?? e.touches?.[0]?.clientY;
      rotY += (x - lastX) * 0.008;
      rotX = Math.max(-0.8, Math.min(0.8, rotX + (y - lastY) * 0.006));
      lastX = x;
      lastY = y;
    }

    function pointerUp() {
      dragging = false;
    }

    orb.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointermove", pointerMove);
    window.addEventListener("pointerup", pointerUp);
    orb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") rotY -= 0.15;
      if (e.key === "ArrowRight") rotY += 0.15;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        orb.classList.add("is-touched");
        velY = 0.03;
        setTimeout(() => (velY = 0.004), 600);
      }
    });
  }

  /* ── Work strip ── */
  const track = document.getElementById("stripTrack");
  const stripNow = document.getElementById("stripNow");
  const cards = track ? Array.from(track.children) : [];
  let idx = 0;

  function updateStrip() {
    if (!track || !cards.length) return;
    const card = cards[0];
    const step = card.getBoundingClientRect().width + 16;
    track.style.transform = `translateX(${-idx * step}px)`;
    if (stripNow) stripNow.textContent = String(idx + 1).padStart(2, "0");
  }

  document.getElementById("stripPrev")?.addEventListener("click", () => {
    idx = (idx - 1 + cards.length) % cards.length;
    updateStrip();
  });
  document.getElementById("stripNext")?.addEventListener("click", () => {
    idx = (idx + 1) % cards.length;
    updateStrip();
  });
  window.addEventListener("resize", updateStrip);

  /* ── Why tabs ── */
  const whyCopy = {
    build: { k: "01 / Mount", t: "Cold plate mounts on the GPU, CPU, or accelerator package." },
    understand: { k: "02 / Transfer", t: "Liquid carries heat through the CDU and rack manifold." },
    improve: { k: "03 / Reject", t: "Facility loops reject thermal load outside the building." },
  };

  document.querySelectorAll(".why-word").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".why-word").forEach((b) => b.classList.remove("is-on"));
      btn.classList.add("is-on");
      const data = whyCopy[btn.dataset.go];
      if (!data) return;
      const k = document.getElementById("whyPanelK");
      const t = document.getElementById("whyPanelT");
      if (k) k.textContent = data.k;
      if (t) t.textContent = data.t;
    });
  });

  /* ── Audit form (demo) ── */
  const form = document.getElementById("heroAuditForm");
  const toast = document.getElementById("toast");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!toast) return;
    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  });
})();
