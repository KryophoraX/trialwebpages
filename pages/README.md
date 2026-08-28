# Pages

Each folder is a **standalone hero / home page** with its own HTML, CSS, and JS.

| Folder | Status | Style |
|--------|--------|-------|
| [`hayagreeva-energy/`](hayagreeva-energy/) | Live | KoolMicro scroll-snap, Montserrat wordmark, blue |
| [`daynight-style/`](daynight-style/) | Live | Hayagreeva + DayNight structure: blue orb, cool→deep scroll |
| [`hayagreeva-kaiko/`](hayagreeva-kaiko/) | Live | Kaiko-style: navy beam hero, cream panel, orb feature grid |
| [`hayagreeva-flare/`](hayagreeva-flare/) | Live | Dark cinematic: animated blue sine beam, glass cards, HEx |
| [`hayagreeva-liquid-glass/`](hayagreeva-liquid-glass/) | Disabled | Liquid glass, fuzzy blur, Cormorant serif, centered |
| [`hayagreeva-noctra/`](hayagreeva-noctra/) | Disabled | Dark exhibition / Noctra-style: grain, serif + mono, cinematic black |

**Disabled pages:** `index.html` redirects to the hub. Restore from `index.live.html` to re-enable.

## Conventions

```
pages/your-page/
  index.html
  styles.css
  script.js
  assets/         # optional
```

- Use root-relative links when served locally: `/`, `/pages/other-page/`
- Run `./serve.sh` from repo root
- Keep pages independent — no shared build step

## Adding another page

1. Copy an existing page folder as a starting point.
2. Rename and replace content.
3. Add a card in the root [`index.html`](../index.html).
4. Add the URL to [`serve.sh`](../serve.sh) output.
