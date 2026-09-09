# Juyoung Jenna Yun — personal site

Static single page. No build step, no dependencies.

## Files

| Path | |
|---|---|
| `index.html` | The page. The hero brain SVG is inline because `script.js` reads `getTotalLength()` off its path and `styles.css` animates `stroke-dashoffset` — an external `<img>` or `<use>` can't be reached by either. |
| `styles.css` | All styling, including the self-hosted `@font-face` rules. |
| `script.js` | Brain path length for the draw loop, scroll progress, active-section tracking. |
| `fonts/` | IBM Plex Serif + Mono, latin subset, weights 400/500/600. Self-hosted — no external requests. |
| `favicon-32.png`, `apple-touch-icon.png` | Icons, generated from `brain.png` via `sips`. |
| `brain.png`, `brain.svg` | Source artwork. **Not served** — kept for future edits. `brain.svg` is the extracted hero path; the same data is inline in `index.html`. |

## Local preview

```sh
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy

GitHub Pages, `main` branch, `/` root. All paths are relative, so it works at
a domain root or under a `/repo-name/` subpath.
