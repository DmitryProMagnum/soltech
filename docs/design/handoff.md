# Handoff: SolTech — Home Page

## Overview
Marketing home page for SolTech, a solar panel installation company in Dubai operating under the DEWA Shams Dubai programme. The site sells a **financial outcome**: replacing DEWA grid electricity (0.38–0.46 AED/kWh) with self-generated solar (~0.11 AED/kWh). Tone: financial/wealth platform — numbers, charts, air, calm confidence. NOT an eco-catalog.

## About the Design Files
The files in this bundle are **design references created in HTML** — a working prototype showing the intended look and behavior, not production code to copy directly. Your task is to **recreate this design in the target codebase's existing environment** (React, Next.js, Vue, etc.) using its established patterns and libraries. If no environment exists yet, choose the most appropriate framework (recommended: Next.js/Astro for a marketing site with SEO needs — Shams Dubai Guide etc. are SEO pages).

`SolTech Home.dc.html` uses a proprietary component format; read the markup inside `<x-dc>` as the template (inline styles = source of truth for all styling) and the `Component` class at the bottom as the interaction logic. `{{ name }}` holes are bound to values from `renderVals()`.

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, and interactions are final design intent. Recreate pixel-perfectly. All numeric examples are illustrative models and must keep their "illustrative" labels.

## Design Tokens

### Colors
| Token | Hex | Usage |
|---|---|---|
| Ink navy | `#16345E` | Primary text, primary buttons, DEWA chart line |
| Deep navy | `#0E2440` | Dark section backgrounds (calculator, final CTA, warehouse card), hero DEWA price card |
| Accent orange | `#F08018` | Single accent: prices, badges, links hover, solar chart line, CTA in dark sections |
| Orange hover | `#FF9633` | Orange button hover |
| Paper bg | `#F6F5F1` | Page background |
| White | `#FFFFFF` | Cards, light sections |
| Muted text | `#5C6B80` | Secondary text |
| Faint text | `#8B96A5` | Tertiary text, labels |
| Border | `#E5E2D9` / `#ECEAE2` | Hairlines, dashed dividers |
| WhatsApp green | `#25D366` | Floating WhatsApp button only |
| On dark: text 55–60% | `rgba(255,255,255,.55/.6)` | Secondary text on navy |

### Typography
- **Display + body**: "Schibsted Grotesk" (Google Fonts), weights 400–900. Headings weight 800, letter-spacing −0.02em.
- **Data/mono**: "IBM Plex Mono" 400/500/600 — ALL numbers, eyebrows, labels. `font-variant-numeric: tabular-nums` on every number.
- Scale: H1 60/1.04; H2 42–48; big prices 64px mono; calculator stat numbers 44px mono; body 15.5–19px, line-height 1.55–1.65; eyebrows 11–12px mono, letter-spacing .18–.2em, uppercase.
- Eyebrow pattern: 8×8px orange square + mono uppercase label.

### Spacing & shape
- Container: max-width 1200px, 32px side padding. Section padding ~100–110px vertical.
- Radius: cards 18px, buttons 10px, pills 999px. Buttons padding 16–17px × 28–30px, weight 600–700.
- Dashed 1px dividers (`#E5E2D9` light / `rgba(255,255,255,.2)` dark) for data rows.
- Shadows: soft, e.g. `0 24px 60px -24px rgba(14,36,64,.45)`.

## Screens / Sections (single page, top to bottom)

### 1. Sticky header
72px, `rgba(246,245,241,.86)` + `backdrop-filter: blur(14px)`, 1px bottom border. Logo wordmark "SOLTECH" (800, letter-spacing .04em) with orange dot centered inside the O (absolute-positioned .26em circle). Nav: Calculator / Villas / Business / How it works / FAQ. Right: navy button "Calculate my savings".

### 2. Hero
Subtle dotted-grid background: `radial-gradient(rgba(22,52,94,.08) 1px, transparent 1px)`, 26px grid. Two-column grid 1.05fr/0.95fr, gap 72px.
- Left: eyebrow "SHAMS DUBAI · GRID-TIED SOLAR · DUBAI, UAE"; H1 "Stop paying **0.46 AED** (orange) per kilowatt-hour." (non-breaking hyphen in kilowatt-hour); sub "Generate your own power at a fraction of the cost — and cut your DEWA bill for the next 25 years."; CTAs: navy solid "Calculate my savings" (→ #calc) + outlined "Get a free assessment" (→ WhatsApp deep link); small trust line.
- Right — **signature element**: two stacked price-tag cards. Card 1 (deep navy): "DEWA GRID · TODAY", 64px mono white "0.46" AED/kWh, dashed divider, footnote "Top residential slab, incl. fuel surcharge & VAT". Card 2 (white, 1.5px orange border, offset 44px left-margin, −16px top overlap): "YOUR SOLAR · 25 YEARS", orange "~0.11", footnote "Levelised cost … illustrative model". Between them: orange circle badge "−76%", 76px, rotated −8°.
- Load animation: staggered fadeUp (opacity 0 + translateY(28px) → none), 0.8–0.9s cubic-bezier(.16,.7,.2,1), delays 0/.1/.2/.3/.4s; price numbers **count up** from 0.00 to 0.46 / 0.11 over 1.4s (cubic ease-out), starting at 500/750ms.

### 3. Savings calculator (#calc) — dark navy section
H2 "What would your kilowatt-hour cost?". Two columns:
- Left card (`rgba(255,255,255,.05)` bg, 1px `rgba(255,255,255,.12)` border): label "YOUR AVERAGE MONTHLY DEWA BILL", 58px mono white amount, range slider 500–20,000 step 100 (default 3,000). Slider: 6px track, filled portion orange (gradient split at value %), 26px white thumb with 4px orange border. Below: orange CTA "Get my full report on WhatsApp" + "Your phone number is the only required field".
- Conditional honest note when bill < 1,500 AED (orange-tinted box): economics are weaker, leave your number.
- Right: three white stat cards (label + context left, 44px mono number right): "YOUR PRICE PER KWH ~0.11" with "vs {rate} AED from DEWA — {n}% cheaper"; "ESTIMATED SAVINGS {n} AED/yr" (orange number); "PAYBACK PERIOD {n} years".
- Footnote: pre-assessment estimate, link to methodology.

**Signature motion**: on slider input, displayed numbers **tween** to new targets over 380ms (cubic ease-out) via rAF — this is the page's one orchestrated motion moment; everything else stays quiet.

Calculator math (illustrative, keep conservative):
```
rate    = clamp(0.36 + bill/40000, 0.38, 0.46)   // blended DEWA AED/kWh
kwh     = bill / rate                             // monthly consumption
save    = kwh * 12 * 0.85 * (rate - 0.11)         // AED/yr, 85% coverage
capex   = (kwh * 0.85 / 155) * 4000               // AED (155 kWh/kWp·mo, 4000 AED/kWp)
payback = capex / save                            // years
```

### 4. 25-year comparison (#compare) — white section
H2 "Keep paying DEWA — or stop." + legend (navy "Keep paying DEWA", orange "Go solar"). Chart card (1px border, 18px radius, subtle vertical gradient `#FDFDFB→#F9F8F4`): SVG line chart, cumulative cost over 25 years. Y axis 0→1M AED (gridlines every 250k), X Year 0→25. DEWA line: (yr0, 0)→(yr25, 900k), navy 3px. Solar line: (yr0, 150k)→(yr25, 375k), orange 3px. Break-even dot ≈ year 6; orange 10%-opacity polygon between lines after crossover labeled "≈ 525,000 AED kept"; end labels "DEWA · ~900,000 AED" / "Solar · ~375,000 AED". Footnote: "Illustrative model: villa, ~3,000 AED/month bill, 12 kWp… tariff escalation assumed 0%."
Animation (starts when scrolled into view): lines draw via stroke-dashoffset (pathLength 1 → 0, 1.6s, delays .2/.45s), then area/labels fade in (delays 1.2–1.9s).

### 5. Trust row — paper bg
4 equal columns, each: 2px navy top border, mono orange number 01–04, bold title, muted description. Items: Shams Dubai programme / DEWA-eligible equipment only / In-house engineering / Open methodology.

### 6. Journey (#how) — white section
H2 "From first calculation to 25 years of savings." 7-column grid, each step: 2px top border with 10px dot on it (orange for steps 01 and 07, navy otherwise), mono label "0N · DURATION", bold title. Steps: Calculate (2 min) → Engineering assessment (≤3 days) → Financial proposal (24 h) → DEWA approval (filed ≤5 days) → Installation (2–7 days) → Monitoring (day one) → 25 years of savings (ongoing, all-orange). Footnote: villa live in 45–60 days.

### 7. Model scenarios (#models)
H2 "Two roofs, one logic." Two cards: Villa · 12 kWp (white) and Warehouse · 300 kWp (deep navy, for business). Each: "ILLUSTRATIVE MODEL" pill, dashed-divider spec rows. Villa: 21,000 kWh/yr, ~85% offset, ~5 years payback, ~180,000 AED 25-yr savings (orange). Warehouse: 525,000 kWh/yr, IRR ~19%, ~4.5 years, ~3.9M AED. Card links: "Run my villa's numbers →" (#calc) / "Book an engineering assessment →" (WhatsApp) — orange bottom-border underline style.

### 8. FAQ (#faq) — white section, 820px centered
H2 "Questions people actually ask." 5 accordion items, 1px separators, "+" icon (orange mono 22px) rotates 45° when open. Body collapses via `grid-template-rows: 0fr↔1fr` transition (.4s) with `overflow:hidden` inner wrapper. Content covers: selling the villa (system transfers, DEWA credits don't), grid outage (honest NO without storage), timeline (45–60 days), warranties (25yr panels / 5–10yr inverters / single workmanship warranty), maintenance (minimal).

### 9. Final CTA (#contact) — deep navy, centered
Eyebrow "READY WHEN YOU ARE", H2 48px "The next 25 years of your power bill are being written now.", sub "A pre-calculation takes 24 hours. The engineering assessment is free." Orange button + white outlined WhatsApp button.

### 10. Footer — paper bg
4 columns: brand + tagline; EXPLORE (Savings calculator, Solar for villas, Solar for business, How it works); LEARN (Shams Dubai guide, Equipment we install, Calculator methodology, Why SolTech — future pages, currently anchor placeholders); CONTACT (WhatsApp, hello@soltech.ae, hours). Bottom bar: © + disclaimer "All figures shown are illustrative models, not quotes."

### Floating WhatsApp button
Fixed bottom-right 26px, 60px green circle, white WhatsApp glyph, infinite soft pulse ring (box-shadow keyframes, 2.6s). Present on all pages per brief.

## Interactions & Behavior
- Smooth-scroll anchor navigation (`scroll-behavior: smooth`).
- Scroll reveals: every `[data-reveal]` element starts opacity 0 / translateY(26px) and transitions in (.9s, cubic-bezier(.16,.7,.2,1)) when 12% visible (IntersectionObserver, one-shot); `data-reveal-delay` sets per-element stagger (70–420ms). Chart SVG animations are `animation-play-state: paused` until the card reveals.
- Buttons: hover lift `translateY(-2px)` on solid buttons; outlined buttons recolor border/text to orange. Links hover → orange.
- WhatsApp deep links: `https://wa.me/{number}?text={prefilled}`; calculator CTA embeds the current bill amount in the message.
- Configurable parameters in the prototype (map to CMS/env config): `solarRate` (default 0.11), `whatsappNumber`, `showWhatsApp`.

## State Management
- `bill` (number, 3000 default) — slider value.
- `disp` {rate, save, payback} — tweened display values (rAF, 380ms cubic ease-out toward computed targets).
- `faq` (index | −1) — single-open accordion.

## Responsive
The prototype is desktop (1200px container). Brief demands **mobile-first** production: stack hero columns (price tags below H1), calculator columns, model cards; journey 7-col grid → vertical list; trust 4-col → 2×2; min 44px touch targets. Keep the slider-tween signature moment on mobile.

## Copy rules (from client brief — enforce)
- Never write: "DEWA pays you" / "sell your energy"; DEWA tariff growth predictions; "backup power" without storage; property-value growth %; fictional case studies as real.
- All example figures carry "illustrative model" labels.
- Future i18n: Latin + Arabic (RTL), later Cyrillic — keep layout RTL-friendly.

## Assets
- `logo.png` — client logo (navy wordmark + orange sun/panel emblem). The prototype recreates the wordmark in HTML/CSS (SOLTECH with orange dot in the O); use the real logo asset in production.
- Fonts via Google Fonts: Schibsted Grotesk, IBM Plex Mono.
- WhatsApp icon: inline SVG path (included in the HTML).
- No photography used; if photos are added later, brief forbids: eco-gradients, leaves, panels-at-sunset, globes.

## Files
- `SolTech Home.dc.html` — the full design reference (template + interaction logic).
- `soltech-site-brief.md` — original client brief: full sitemap, per-page content specs, and copy prohibitions for the remaining pages (Calculator, Villas, Business, How It Works, Why, Shams Guide, Equipment, Methodology, Contact).
- `logo.png` — client logo.
