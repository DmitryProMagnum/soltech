# SolTech — Home Page

Static marketing site for **SolTech**, a solar-panel installation company in Dubai (Shams Dubai / grid-tied).
Built to the client design handoff (financial / wealth-platform aesthetic — navy + single orange accent, tabular numbers, charts), with three client additions on top: a **full-banner video hero**, the client's **installation photography**, and **motion in every block**.

## Run it

No build step. Easiest is the bundled zero-dependency server (adds proper MIME types + HTTP range so the video streams):

```bash
node server.js        # -> http://localhost:8080
```

Or just open `index.html` directly (double-click), or use any static server (`npx serve .`).
Opening over `http://` (not `file://`) is recommended so the video autoplays reliably.

## Structure

```
index.html              # the whole page
assets/
  css/styles.css        # design tokens + all sections + responsive + reduced-motion
  js/script.js          # count-ups, calculator tween, chart draw, reveals, FAQ, nav, parallax
  img/                  # the 5 photos (semantic names) + hero-poster.jpg
solar.mp4               # full-banner hero video (1910×1028, ~30s)
```

The original hash-named JPGs are kept at the repo root; the site references the renamed copies in `assets/img/`.

## What's interactive / animated

- **Hero** — video autoplays (muted, looped), staggered text load-in, the two price cards, and count-up on `0.46` / `0.11`.
- **Calculator** — drag the slider; the DEWA rate, yearly savings and payback **tween** to new values (the signature motion moment). A low-bill honesty note appears under 1,500 AED. The WhatsApp CTA embeds the current bill.
- **25-year chart** — SVG lines **draw in** on scroll; the "525,000 AED kept" area and labels fade in after.
- **Every section** reveals on scroll; gallery/model images zoom on hover; the "Why SolTech" photo has a subtle parallax; FAQ is an animated accordion.
- All motion collapses to static under `prefers-reduced-motion`, and every hidden-until-JS state is gated behind a `.js` class so the page is fully readable even if JS never runs.

## Deploying

See **[DEPLOY.md](DEPLOY.md)** for the full guide (Netlify / Cloudflare Pages / Vercel + custom domain). Config files (`netlify.toml`, `vercel.json`, `_headers`), `robots.txt` and `sitemap.xml` are already in the repo.

## Before going live — replace these placeholders

1. **Domain** — the canonical URL, Open Graph tags, JSON-LD, `sitemap.xml` and `robots.txt` all use `https://soltech.solutions`. Find/replace with your real domain if different.
2. **WhatsApp number** — every link uses `971500000000`. Find/replace it in `index.html` and in `script.js` (`setReportHref`) with the real number.
3. **Email** — `hello@soltech.solutions` in the footer.
4. **Local SEO** — add `telephone` + a full postal `address` to the `LocalBusiness` JSON-LD in `index.html` (powers Google map/local results).
5. **Source video** — `solar.mp4` (32 MB, in `.gitignore`) is the source only. The site serves `solar.webm` (1.6 MB) + `solar-1600.mp4` (1.9 MB). Don't upload `solar.mp4`.
6. All figures on the page are **illustrative models** (as required by the client brief) and carry that label.

## Performance / SEO (done)
- Hero video **32 MB → 1.6 MB** (WebM) / 1.9 MB (MP4). Images served as **WebP** (`<picture>` + JPG fallback). Fonts self-hosted (`.woff2`, `unicode-range` subset, preloaded).
- LCP poster + fonts preloaded; JS deferred; long-cache headers per host.
- Semantic landmarks + skip link, canonical + OG/Twitter + geo meta, SVG favicon, `LocalBusiness` + `FAQPage` JSON-LD, `robots.txt`, `sitemap.xml`.
- Fonts note: Schibsted Grotesk is Latin-only — a future Arabic/Cyrillic version needs a different family, per the design brief.
