# Pages

Each folder is a **standalone hero / home page** with its own HTML, CSS, and JS.

| Folder | Status | Style |
|--------|--------|-------|
| [`hayagreeva-energy/`](hayagreeva-energy/) | Live | KoolMicro scroll-snap, Montserrat wordmark, blue |
| [`hayagreeva-liquid-glass/`](hayagreeva-liquid-glass/) | Live | Liquid glass, fuzzy blur, Cormorant serif, centered |
| [`daynight-style/`](daynight-style/) | Live | Hayagreeva + DayNight structure: blue orb, cool→deep scroll |
| [`hayagreeva-noctra/`](hayagreeva-noctra/) | Live | Dark exhibition / Noctra-style: grain, serif + mono, cinematic black |
| [`hayagreeva-kaiko/`](hayagreeva-kaiko/) | Live | Kaiko-style: navy beam hero, cream panel, orb feature grid |
| [`hayagreeva-flare/`](hayagreeva-flare/) | Live | Dark cinematic: animated prismatic flares, glass cards, HEx |

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
