(() => {
  const canvas = document.getElementById("flare-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const SCALE = 0.5;
  const TARGET_FPS = 30;
  const FRAME_MS = 1000 / TARGET_FPS;

  let w = 0;
  let h = 0;
  let cw = 0;
  let ch = 0;
  let raf = 0;
  let t0 = performance.now();
  let lastDraw = 0;

  // Each wave carries its own spectrum (RGB stops along the sine)
  const waves = [
    {
      y: 0.46,
      amp: 0.22,
      freq: 1.05,
      phase: 0,
      speed: 0.65,
      drift: 0.06,
      // magenta → coral → gold → mint → cyan
      stops: [
        [255, 70, 160],
        [255, 120, 70],
        [255, 210, 90],
        [120, 255, 180],
        [80, 200, 255],
      ],
    },
    {
      y: 0.6,
      amp: 0.15,
      freq: 1.5,
      phase: 2.1,
      speed: 0.45,
      drift: -0.04,
      // violet → blue → teal → lime
      stops: [
        [160, 80, 255],
        [70, 140, 255],
        [40, 220, 230],
        [160, 255, 120],
        [255, 200, 80],
      ],
    },
    {
      y: 0.36,
      amp: 0.1,
      freq: 1.9,
      phase: 4.0,
      speed: 0.8,
      drift: 0.05,
      // deep blue → cyan → white-pink → orange
      stops: [
        [40, 80, 255],
        [60, 220, 255],
        [255, 200, 220],
        [255, 140, 60],
        [255, 80, 100],
      ],
    },
  ];

  const points = new Float32Array(256);

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    cw = Math.max(1, Math.floor(w * SCALE));
    ch = Math.max(1, Math.floor(h * SCALE));
    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  function lerpColor(stops, t) {
    const n = stops.length - 1;
    const x = Math.max(0, Math.min(1, t)) * n;
    const i = Math.min(n - 1, Math.floor(x));
    const f = x - i;
    const a = stops[i];
    const b = stops[i + 1];
    return [
      (a[0] + (b[0] - a[0]) * f) | 0,
      (a[1] + (b[1] - a[1]) * f) | 0,
      (a[2] + (b[2] - a[2]) * f) | 0,
    ];
  }

  function fillPoints(wave, time, count) {
    const yBase = ch * wave.y + Math.sin(time * wave.drift + wave.phase) * ch * 0.025;
    const amp = ch * wave.amp;
    const phase = wave.phase + time * wave.speed;
    const x0 = -cw * 0.05;
    const span = cw * 1.1;
    const n = Math.min(count, points.length / 2);

    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      points[i * 2] = x0 + span * u;
      points[i * 2 + 1] = yBase + Math.sin(u * Math.PI * 2 * wave.freq + phase) * amp;
    }
    return n;
  }

  function strokeBand(n, width, stops, alpha, hueShift) {
    // Short segments so the spectrum rides along the sine
    const segs = 32;
    ctx.lineWidth = width;
    for (let s = 0; s < segs; s++) {
      const u0 = s / segs;
      const u1 = (s + 1) / segs;
      const i0 = Math.floor(u0 * (n - 1));
      const i1 = Math.max(i0 + 1, Math.floor(u1 * (n - 1)));
      const mid = (u0 + u1) * 0.5;
      const edge = Math.min(mid, 1 - mid);
      const fade = Math.min(1, edge / 0.1);
      if (fade < 0.02) continue;

      const [r, g, b] = lerpColor(stops, (mid + hueShift) % 1);
      ctx.beginPath();
      ctx.moveTo(points[i0 * 2], points[i0 * 2 + 1]);
      for (let i = i0 + 1; i <= i1; i++) {
        ctx.lineTo(points[i * 2], points[i * 2 + 1]);
      }
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * fade})`;
      ctx.stroke();
    }
  }

  function drawWave(wave, time) {
    const n = fillPoints(wave, time, 64);
    const pulse = 0.8 + 0.2 * Math.sin(time * wave.speed * 0.8 + wave.phase);
    // Slow color drift along the graph
    const hueShift = (time * 0.08 + wave.phase * 0.1) % 1;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    strokeBand(n, 44, wave.stops, 0.08 * pulse, hueShift);
    strokeBand(n, 22, wave.stops, 0.14 * pulse, hueShift);
    strokeBand(n, 10, wave.stops, 0.28 * pulse, hueShift);
    strokeBand(n, 3.5, wave.stops, 0.55 * pulse, hueShift);
    // Hot white core
    strokeBand(n, 1.4, [[255, 255, 255], [255, 255, 255]], 0.7 * pulse, 0);
  }

  function frame(now) {
    if (!reduced) raf = requestAnimationFrame(frame);

    if (now - lastDraw < FRAME_MS) return;
    lastDraw = now;

    const time = (now - t0) / 1000;

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, cw, ch);

    const g = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 0, cw * 0.5, ch * 0.45, ch * 0.65);
    g.addColorStop(0, "rgba(28, 24, 48, 0.35)");
    g.addColorStop(1, "rgba(5, 5, 5, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, cw, ch);

    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < waves.length; i++) drawWave(waves[i], time);
    ctx.globalCompositeOperation = "source-over";
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
