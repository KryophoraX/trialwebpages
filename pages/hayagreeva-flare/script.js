(() => {
  const canvas = document.getElementById("flare-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Near-full res keeps the ribbon smooth when scaled up
  const SCALE = 0.75;
  const TARGET_FPS = 30;
  const FRAME_MS = 1000 / TARGET_FPS;
  const STEPS = 120;

  let cw = 0;
  let ch = 0;
  let raf = 0;
  let t0 = performance.now();
  let lastDraw = 0;

  // Preallocated sample buffers
  const xs = new Float32Array(STEPS + 1);
  const ys = new Float32Array(STEPS + 1);
  const nxs = new Float32Array(STEPS + 1);
  const nys = new Float32Array(STEPS + 1);

  const wave = {
    y: 0.5,
    amp: 0.18,
    freq: 1.05,
    phase: 0,
    speed: 0.45,
    drift: 0.04,
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

    // Smooth normals from neighboring points
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

  function softGradient(alpha, time) {
    // Blue-only ribbon — deep → electric → ice, soft end fades
    const shift = (time * 0.05) % 1;
    const g = ctx.createLinearGradient(0, 0, cw, 0);
    const colors = [
      [30, 70, 180],
      [50, 120, 255],
      [120, 190, 255],
      [200, 230, 255],
      [70, 150, 255],
      [40, 90, 210],
    ];
    const n = colors.length;
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      const idx = (i + Math.floor(shift * n)) % n;
      const next = (idx + 1) % n;
      const f = (shift * n) % 1;
      const r = (colors[idx][0] + (colors[next][0] - colors[idx][0]) * f) | 0;
      const gC = (colors[idx][1] + (colors[next][1] - colors[idx][1]) * f) | 0;
      const b = (colors[idx][2] + (colors[next][2] - colors[idx][2]) * f) | 0;
      const edge = Math.min(t, 1 - t);
      const fade = Math.min(1, edge / 0.18);
      g.addColorStop(t, `rgba(${r},${gC},${b},${alpha * fade})`);
    }
    return g;
  }

  function draw(time) {
    sampleWave(time);
    const pulse = 0.88 + 0.12 * Math.sin(time * 0.6);

    ctx.globalCompositeOperation = "lighter";

    // Outer bloom — wide, very soft, one fill
    fillRibbon(42);
    ctx.fillStyle = softGradient(0.07 * pulse, time);
    ctx.fill();

    fillRibbon(26);
    ctx.fillStyle = softGradient(0.12 * pulse, time);
    ctx.fill();

    // Main body of the light
    fillRibbon(14);
    ctx.fillStyle = softGradient(0.28 * pulse, time);
    ctx.fill();

    fillRibbon(7);
    ctx.fillStyle = softGradient(0.4 * pulse, time);
    ctx.fill();

    // Soft blue-white core
    fillRibbon(2.8);
    ctx.fillStyle = `rgba(210,235,255,${0.4 * pulse})`;
    ctx.fill();

    fillRibbon(1.1);
    ctx.fillStyle = `rgba(230,245,255,${0.7 * pulse})`;
    ctx.fill();

    ctx.globalCompositeOperation = "source-over";
  }

  function frame(now) {
    if (!reduced) raf = requestAnimationFrame(frame);
    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;

    const time = (now - t0) / 1000;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    const ambient = ctx.createRadialGradient(
      cw * 0.5, ch * 0.48, 0,
      cw * 0.5, ch * 0.48, ch * 0.7
    );
    ambient.addColorStop(0, "rgba(18, 28, 55, 0.32)");
    ambient.addColorStop(1, "rgba(5, 5, 5, 0)");
    ctx.fillStyle = ambient;
    ctx.fillRect(0, 0, cw, ch);

    draw(time);
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
