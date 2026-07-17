# Deploying SolTech to a domain

The site is a **static site** (HTML + CSS + JS + media) — it can go on any static host, free tiers included. No build step.

---

## 1. Before you deploy — 3 quick edits

### a) Set your real domain
Everything currently uses the placeholder **`https://soltech.solutions`**. Find-and-replace it with your real domain in:

- `index.html` — canonical link, `og:url`, `og:image`, `twitter:image`, and both JSON-LD blocks
- `sitemap.xml`
- `robots.txt`

(If your domain *is* `soltech.solutions`, nothing to change.)

### b) Don't upload the 32 MB source video
The site plays **`solar-1600.mp4` (1.9 MB)** and **`solar.webm` (1.6 MB)**. The original **`solar.mp4` (32 MB)** is only a source file — it's already in `.gitignore`. If you deploy by drag-and-drop, **delete `solar.mp4` first** so you don't upload 32 MB for nothing.

### c) (Recommended) Add phone + address for local SEO
In `index.html`, the `LocalBusiness` JSON-LD has no phone or street address. Add `"telephone"` and a full `"address"` (street, PO box) — this is what powers Google's local/map results.

---

## 2. Put it on a domain (pick one)

### Option A — Netlify (easiest, free, custom domain in minutes)
1. Go to **app.netlify.com** → "Add new site" → "Deploy manually".
2. Drag the **`Soltech` folder** onto the page (after deleting `solar.mp4`).
3. It's live at a `*.netlify.app` URL instantly.
4. Site settings → **Domain management** → "Add a custom domain" → enter your domain → follow the DNS steps (point your domain's nameservers to Netlify, or add the CNAME/A records they show). HTTPS is automatic.
- `netlify.toml` (already in the folder) sets long-cache headers; Netlify auto-compresses with Brotli.

### Option B — Cloudflare Pages (free, great if your domain is on Cloudflare)
1. **dash.cloudflare.com** → Workers & Pages → Create → Pages → "Upload assets" (or connect a Git repo).
2. Upload the folder. Deploys instantly.
3. Custom domain: Pages project → "Custom domains" → add yours (one click if the domain is already on Cloudflare).
- `_headers` (already included) handles caching.

### Option C — Vercel
1. **vercel.com** → Add New → Project → import the Git repo (or `npx vercel` from the folder).
2. Framework preset: **Other** (it's static).
3. Add your domain under Project → Settings → Domains.
- `vercel.json` (already included) handles caching.

### Option D — your own hosting / cPanel
Upload the folder contents to `public_html` (or the web root) via FTP. Ensure the host serves `index.html` as the default and has gzip/Brotli on. The `solar-1600.mp4` needs HTTP **Range** support (standard on Apache/Nginx) for smooth video.

---

## 3. After it's live
1. **Google Search Console** (search.google.com/search-console): add your domain → verify → submit `https://YOURDOMAIN/sitemap.xml`.
2. **Test rich results**: search.google.com/test/rich-results → paste your URL. You should see **FAQ** and **LocalBusiness** detected.
3. **Speed**: run pagespeed.web.dev on the live URL. With the compressed video + WebP images + long-cache headers you should score well; the hero video is the main weight (now ~1.6–1.9 MB vs 32 MB before).

---

## What was optimized for speed
- **Hero video 32 MB → 1.6 MB (WebM) / 1.9 MB (MP4)**, `preload="metadata"`, poster shown first, pauses off-screen and under reduced-motion.
- **Images → WebP** with JPG fallback (`<picture>`); the 425 KB engineers photo is now ~90 KB.
- **Self-hosted fonts** (WebP-era woff2, `unicode-range` subsetting, preloaded) — no Google Fonts round-trip.
- **Preload** of the LCP poster + critical fonts; **deferred** JS; CSS is one small file (host Brotli ≈ minified size).
- **Immutable long-cache** on all fingerprint-stable assets (config files included per host).

## SEO architecture in place
- Semantic landmarks (`<header> <main> <footer> <nav>`), one `<h1>`, section `<h2>`s, skip link, alt text on every image.
- Canonical URL, robots meta, geo tags, full Open Graph + Twitter cards, SVG favicon.
- **JSON-LD**: `LocalBusiness` (Dubai solar) + `FAQPage` (eligible for FAQ rich results).
- `robots.txt` + `sitemap.xml`.
- Ready to extend to multiple pages (Calculator, Villas, Business, Shams Dubai guide…) — add each to `sitemap.xml` and give it its own canonical + title/description.
