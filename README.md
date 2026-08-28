# Trial Web Pages

Standalone hero pages — each in its own folder under `pages/`.

## Live (GitHub Pages)

- **Hub:** https://kryophorax.github.io/trialwebpages/
- **Energy:** https://kryophorax.github.io/trialwebpages/pages/hayagreeva-energy/
- **Orb:** https://kryophorax.github.io/trialwebpages/pages/daynight-style/
- **Kaiko:** https://kryophorax.github.io/trialwebpages/pages/hayagreeva-kaiko/
- **Flare:** https://kryophorax.github.io/trialwebpages/pages/hayagreeva-flare/

## Run locally

Serve from the **repo root**:

```bash
./serve.sh
```

Then open:

- **Hub:** http://127.0.0.1:8080/
- **Page 1 — Energy:** http://127.0.0.1:8080/pages/hayagreeva-energy/
- **Page 2 — Orb:** http://127.0.0.1:8080/pages/daynight-style/
- **Page 3 — Kaiko:** http://127.0.0.1:8080/pages/hayagreeva-kaiko/
- **Page 4 — Flare:** http://127.0.0.1:8080/pages/hayagreeva-flare/

## Pages

| Page | Folder | Status | Style |
|------|--------|--------|-------|
| Hayagreeva Energy | [`pages/hayagreeva-energy/`](pages/hayagreeva-energy/) | Live | Scroll-snap, blue corporate |
| Hayagreeva Orb | [`pages/daynight-style/`](pages/daynight-style/) | Live | Inspired by [daynight.co.uk](https://www.daynight.co.uk/) |
| Hayagreeva Kaiko | [`pages/hayagreeva-kaiko/`](pages/hayagreeva-kaiko/) | Live | Kaiko-style: navy beams, cream panel, orb grid |
| Hayagreeva Flare | [`pages/hayagreeva-flare/`](pages/hayagreeva-flare/) | Live | Dark cinematic: animated blue sine beam, glass cards |
| Hayagreeva Liquid Glass | [`pages/hayagreeva-liquid-glass/`](pages/hayagreeva-liquid-glass/) | Disabled | Frosted glass, serif, centered |
| Hayagreeva Noctra | [`pages/hayagreeva-noctra/`](pages/hayagreeva-noctra/) | Disabled | Dark exhibition: grain, serif + mono |

Disabled pages redirect to the hub. Original HTML is kept as `index.live.html` in each folder.

See [`pages/README.md`](pages/README.md) for conventions.
