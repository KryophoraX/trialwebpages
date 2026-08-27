(() => {
  const canvas = document.getElementById("flare-bg");
  if (!canvas) return;

  // Transparent canvas — page bg shows through; CSS blurs this into one soft beam
  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SCALE = 0.7;
  const TARGET_FPS = 30;
  const FRAME_MS = 1000 / TARGET_FPS;
  const STEPS = 100;

  let cw = 0;
  let ch = 0;
  let raf = 0;
  let t0 = performance.now();
  let lastDraw = 0;

  const xs = new Float32Array(STEPS + 1);
  const ys = new Float32Array(STEPS + 1);
  const nxs = new Float32Array(STEPS + 1);
  const nys = new Float32Array(STEPS + 1);

  const wave = {
    y: 0.52,
    amp: 0.17,
    freq: 1.05,
    phase: 0,
    speed: 0.4,
    drift: 0.035,
  };

  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    cw = Math.max(1, Math.floor(w * SCALE));
    ch = Math.max(1, Math.floor(h * SCALE));
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function sampleWave(time) {
    const yBase = ch * wave.y + Math.sin(time * wave.drift + wave.phase) * ch * 0.02;
    const amp = ch * wave.amp;
    const phase = wave.phase + time * wave.speed;
    const x0 = -cw * 0.08;
    const span = cw * 1.16;

    for (let i = 0; i <= STEPS; i++) {
      const u = i / STEPS;
      xs[i] = x0 + span * u;
      ys[i] = yBase + Math.sin(u * Math.PI * 2 * wave.freq + phase) * amp;
    }

    for (let i = 0; i <= STEPS; i++) {
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(STEPS, i + 1);
      const dx = xs[i1] - xs[i0];
      const dy = ys[i1] - ys[i0];
      const len = Math.hypot(dx, dy) || 1;
      nxs[i] = -dy / len;
      nys[i] = dx / len;
    }
  }

  function fillRibbon(halfW) {
    ctx.beginPath();
    ctx.moveTo(xs[0] + nxs[0] * halfW, ys[0] + nys[0] * halfW);
    for (let i = 1; i <= STEPS; i++) {
      ctx.lineTo(xs[i] + nxs[i] * halfW, ys[i] + nys[i] * halfW);
    }
    for (let i = STEPS; i >= 0; i--) {
      ctx.lineTo(xs[i] - nxs[i] * halfW, ys[i] - nys[i] * halfW);
    }
    ctx.closePath();
  }

  /** Saturated blue gradient along X — no white wash */
  function blueGradient(alpha) {
    const g = ctx.createLinearGradient(0, 0, cw, 0);
    g.addColorStop(0, `rgba(20, 60, 180, 0)`);
    g.addColorStop(0.12, `rgba(30, 90, 220, ${alpha * 0.55})`);
    g.addColorStop(0.35, `rgba(40, 130, 255, ${alpha})`);
    g.addColorStop(0.5, `rgba(70, 170, 255, ${alpha})`);
    g.addColorStop(0.65, `rgba(40, 130, 255, ${alpha})`);
    g.addColorStop(0.88, `rgba(30, 90, 220, ${alpha * 0.55})`);
    g.addColorStop(1, `rgba(20, 60, 180, 0)`);
    return g;
  }

  function draw(time) {
    sampleWave(time);
    const pulse = 0.9 + 0.1 * Math.sin(time * 0.55);

    ctx.clearRect(0, 0, cw, ch);

    // One body + one brighter core — both blue. CSS blur merges them into one light.
    fillRibbon(18);
    ctx.fillStyle = blueGradient(0.85 * pulse);
    ctx.fill();

    fillRibbon(7);
    ctx.fillStyle = blueGradient(1 * pulse);
    ctx.fill();

    // Cool ice-blue highlight (still blue, not white)
    fillRibbon(2.5);
    const core = ctx.createLinearGradient(0, 0, cw, 0);
    core.addColorStop(0, "rgba(120, 190, 255, 0)");
    core.addColorStop(0.2, `rgba(140, 200, 255, ${0.55 * pulse})`);
    core.addColorStop(0.5, `rgba(180, 220, 255, ${0.7 * pulse})`);
    core.addColorStop(0.8, `rgba(140, 200, 255, ${0.55 * pulse})`);
    core.addColorStop(1, "rgba(120, 190, 255, 0)");
    ctx.fillStyle = core;
    ctx.fill();
  }

  function frame(now) {
    if (!reduced) raf = requestAnimationFrame(frame);
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;
    draw((now - t0) / 1000);
  }

  function start() {
    resize();
    cancelAnimationFrame(raf);
    t0 = performance.now();
    lastDraw = 0;
    if (reduced) {
      frame(t0);
      return;
    }
    raf = requestAnimationFrame(frame);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      if (reduced) frame(performance.now());
    }, 120);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });

  start();
})();
