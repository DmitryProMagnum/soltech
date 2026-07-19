/* ============================================================
   SolTech — interactions & motion
   Vanilla JS, no dependencies. Honors prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const easeOutCubic = (p) => 1 - Math.pow(1 - p, 3);

  /* ---------- Number count-up ---------- */
  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    const target   = parseFloat(el.dataset.countTo);
    const decimals = parseInt(el.dataset.countDecimals || "0", 10);
    const suffix   = el.dataset.countSuffix || "";
    const prefix   = el.dataset.countPrefix || "";
    const delay    = parseInt(el.dataset.countDelay || "0", 10);
    const dur      = parseInt(el.dataset.countDur || "1400", 10);
    const format   = (v) => prefix + v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

    if (reduce) { el.textContent = format(target); return; }

    const start = performance.now() + delay;
    function step(now) {
      const p = clamp((now - start) / dur, 0, 1);
      el.textContent = format(target * easeOutCubic(p));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Chart draw-in ---------- */
  function drawChart(svg) {
    if (!svg || svg.dataset.drawn) return;
    svg.dataset.drawn = "1";
    if (reduce) {
      $$(".draw", svg).forEach((p) => (p.style.strokeDashoffset = "0"));
      $$(".chart-fade", svg).forEach((p) => (p.style.opacity = "1"));
      return;
    }
    $$(".draw", svg).forEach((p) => {
      const d = parseInt(p.dataset.drawDelay || "0", 10);
      p.style.transition = `stroke-dashoffset 1.6s cubic-bezier(.4,0,.2,1) ${d}ms`;
      requestAnimationFrame(() => (p.style.strokeDashoffset = "0"));
    });
    $$(".chart-fade", svg).forEach((p) => {
      const d = parseInt(p.dataset.fadeDelay || "0", 10);
      p.style.transition = `opacity 1s ease ${d}ms`;
      requestAnimationFrame(() => (p.style.opacity = "1"));
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$("[data-reveal]");
  revealEls.forEach((el) => {
    const d = el.getAttribute("data-reveal-delay");
    if (d) el.style.transitionDelay = d + "ms";
  });

  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-in");
        $$("[data-count-to]", el).forEach(countUp);
        const chart = el.querySelector("#compareChart");
        if (chart) drawChart(chart);
        io.unobserve(el);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-in"));
    $$("[data-count-to]").forEach(countUp);
    const chart = $("#compareChart"); if (chart) drawChart(chart);
  }

  /* ---------- Hero counters (above the fold — run now, not on window 'load') ----------
     The script is deferred, so it runs after the DOM is parsed but before paint;
     decoupling from 'load' avoids the count resetting to 0 after the video downloads. */
  $$(".hero [data-count-to]").forEach(countUp);

  /* ============================================================
     Savings calculator
     ============================================================ */
  // Modelled constants (see published methodology):
  const SOLAR_RATE = 0.11;   // AED/kWh — levelised cost of self-generated solar
  const YIELD      = 1750;   // kWh per kWp per year in Dubai (conservative)
  const OFFSET     = 0.85;   // system sized to offset ~85% of annual consumption
  const CO2        = 0.40;   // kg CO2 per kWh — UAE grid emission factor
  const DEGR       = 0.92;   // average panel output over a 25-year life

  // Per-property-type assumptions. rate = all-in DEWA cost/kWh (slab + fuel
  // surcharge + VAT); cost = installed AED per kWp.
  const TYPES = {
    villa:    { rate: 0.40, cost: 3800, min: 500,  max: 20000,  step: 100,  start: 3000  },
    business: { rate: 0.44, cost: 2800, min: 2000, max: 200000, step: 1000, start: 15000 },
  };

  const slider    = $("#billSlider");
  const billVal   = $("#billVal");
  const dewaRate  = $("#dewaRate");
  const cutPct    = $("#cutPct");
  const sysKwp    = $("#sysKwp");
  const capexVal  = $("#capexVal");
  const saveVal   = $("#saveVal");
  const payback   = $("#paybackVal");
  const net25Val  = $("#net25Val");
  const co2Val    = $("#co2Val");
  const scaleMin  = $("#scaleMin");
  const scaleMax  = $("#scaleMax");
  const lowNote   = $("#lowNote");
  const reportCta = $("#reportCta");
  const segs      = $$(".calc__seg");

  let calcType = "villa";

  function compute(bill) {
    const t = TYPES[calcType];
    const annualUse  = (bill / t.rate) * 12;   // kWh / year
    const generation = OFFSET * annualUse;     // kWh / year offset by solar
    const kwp        = generation / YIELD;
    const capex      = kwp * t.cost;
    const save       = generation * t.rate;    // = OFFSET * bill * 12
    return {
      rate: t.rate, kwp, capex, save,
      payback: capex / save,
      net25:   25 * save * DEGR - capex,
      co2:     generation * CO2 / 1000,         // tonnes / year
      cut:     (1 - SOLAR_RATE / t.rate) * 100,
    };
  }

  const roundTo = (n, s) => Math.round(n / s) * s;
  const grp     = (n) => Math.round(n).toLocaleString("en-US");
  // Compact money so large business figures stay legible: >=1M -> "1.9M" / "39M".
  const money   = (n) => n >= 1e6 ? ((n / 1e6 >= 10 ? Math.round(n / 1e6) : (n / 1e6).toFixed(1)) + "M")
                       : n >= 1e5 ? grp(roundTo(n, 1000))
                       : grp(roundTo(n, 100));

  function paint(bill, d) {
    billVal.textContent  = bill.toLocaleString("en-US");
    dewaRate.textContent = d.rate.toFixed(2);
    cutPct.textContent   = Math.round(d.cut);
    sysKwp.textContent   = d.kwp >= 10 ? grp(d.kwp) : d.kwp.toFixed(1);
    capexVal.textContent = money(d.capex);
    saveVal.textContent  = money(d.save);
    payback.textContent  = d.payback.toFixed(1);
    net25Val.textContent = money(d.net25);
    co2Val.textContent   = d.co2 >= 10 ? grp(d.co2) : d.co2.toFixed(1);
  }

  function setSliderFill(bill) {
    const t = TYPES[calcType];
    const pct = (bill - t.min) / (t.max - t.min) * 100;
    slider.style.background =
      `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,.18) ${pct}%)`;
  }

  function setLowNote(bill) {
    if (calcType === "villa" && bill < 1500) lowNote.removeAttribute("hidden");
    else lowNote.setAttribute("hidden", "");
  }

  function setReportHref(bill) {
    const label = calcType === "business" ? "business" : "villa";
    reportCta.href =
      "https://wa.me/971500000000?text=" +
      encodeURIComponent(`Hi SolTech, please send my full savings report. My ${label} monthly bill is about ${bill} AED`);
  }

  function render(bill) {
    setSliderFill(bill);
    setLowNote(bill);
    setReportHref(bill);
    paint(bill, compute(bill));
  }

  function onBill() { render(+slider.value); }

  function setType(type) {
    if (!TYPES[type] || type === calcType) return;
    calcType = type;
    const t = TYPES[type];
    slider.min = t.min; slider.max = t.max; slider.step = t.step; slider.value = t.start;
    if (scaleMin) scaleMin.textContent = t.min.toLocaleString("en-US");
    if (scaleMax) scaleMax.textContent = t.max.toLocaleString("en-US");
    segs.forEach((s) => {
      const on = s.dataset.type === type;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-pressed", on ? "true" : "false");
    });
    render(t.start);
  }

  if (slider) {
    segs.forEach((s) => s.addEventListener("click", () => setType(s.dataset.type)));
    slider.addEventListener("input", onBill);
    slider.addEventListener("change", onBill);
    render(+slider.value);
  }

  /* ============================================================
     FAQ accordion (single-open)
     ============================================================ */
  const faqItems = $$(".faq-item");
  faqItems.forEach((item) => {
    const btn = $(".faq-q", item);
    const ans = $(".faq-a", item);
    btn.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      faqItems.forEach((it) => {
        it.classList.remove("is-open");
        $(".faq-q", it).setAttribute("aria-expanded", "false");
        const a = $(".faq-a", it); if (a) a.setAttribute("aria-hidden", "true");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
        if (ans) ans.setAttribute("aria-hidden", "false");
      }
    });
  });

  /* ============================================================
     Mobile nav
     ============================================================ */
  const navToggle = $("#navToggle");
  const mobileNav = $("#mobileNav");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", mobileNav).forEach((a) =>
      a.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ============================================================
     Header: dark state while over the hero video
     ============================================================ */
  const header = $("#header");
  const hero = $(".hero");
  if (header && hero && "IntersectionObserver" in window) {
    const ho = new IntersectionObserver(
      ([e]) => header.classList.toggle("is-dark", e.isIntersecting && e.intersectionRatio > 0.1),
      { threshold: [0, 0.1, 0.5], rootMargin: "-72px 0px 0px 0px" }
    );
    ho.observe(hero);
  }

  /* Parallax on the engineers photo is now CSS scroll-driven (see styles.css),
     which avoids a scroll listener and forced reflows entirely. */

  /* ============================================================
     Hero video: honor reduced-motion, and pause when off-screen (perf / battery).
     ============================================================ */
  const heroVideo = $(".hero__video");
  if (heroVideo) {
    let userPaused = reduce; // reduced-motion users stay paused (poster shown)
    const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); };

    if (reduce) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }

    if ("IntersectionObserver" in window) {
      const vo = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !userPaused) tryPlay();
        else heroVideo.pause();
      }, { threshold: 0.05 });
      vo.observe(heroVideo);
    }
  }

  /* ============================================================
     Carousel (native, embla-style): arrows, dots, snap scrolling.
     Cards stay swipeable without JS; this adds button/dot control.
     ============================================================ */
  $$("[data-carousel]").forEach((root) => {
    const track = $("[data-carousel-track]", root);
    if (!track || !track.children.length) return;
    const section = root.closest("section") || document;
    const prev = $("[data-carousel-prev]", section);
    const next = $("[data-carousel-next]", section);
    const dots = $$("[data-carousel-dots] .carousel-dot", section);
    const behavior = reduce ? "auto" : "smooth";
    const cards = Array.from(track.children);

    const step = () => {
      const cs = getComputedStyle(track);
      const gap = parseFloat(cs.columnGap || cs.gap) || 20;
      return cards[0].getBoundingClientRect().width + gap;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max - 2;
      if (dots.length) {
        const i = clamp(Math.round(track.scrollLeft / step()), 0, dots.length - 1);
        dots.forEach((d, di) => d.classList.toggle("is-active", di === i));
      }
    };

    if (prev) prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
    if (next) next.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));
    dots.forEach((d, di) => d.addEventListener("click", () => track.scrollTo({ left: di * step(), behavior })));

    let ticking = false;
    track.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { update(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  });

  /* ============================================================
     Journey: one line + a glowing traveler that slowly crosses it,
     igniting each step's dot as it passes. Driven by a CSS variable
     (rAF motion value), gated to the viewport and desktop layout.
     ============================================================ */
  const jGrid = $("[data-journey]");
  if (jGrid) {
    const steps = $$(".step", jGrid);
    const jdots = $$(".step__dot", jGrid);
    const desktop = window.matchMedia("(min-width: 1025px)");
    let thresholds = [], running = false, t0 = 0, jraf = 0;

    const measure = () => {
      const gr = jGrid.getBoundingClientRect();
      thresholds = jdots.map((d) => {
        const r = d.getBoundingClientRect();
        return (r.left + r.width / 2 - gr.left) / (gr.width || 1);
      });
    };
    const setLit = (p) => steps.forEach((s, i) => s.classList.toggle("is-lit", p >= 0 && p >= (thresholds[i] ?? 2)));

    const SWEEP = 7000, HOLD = 1600, FADE = 800, PAUSE = 700;
    const CYCLE = SWEEP + HOLD + FADE + PAUSE;

    const tick = (now) => {
      if (!running) return;
      const t = (now - t0) % CYCLE;
      let p, op, litP;
      if (t < SWEEP)                { p = t / SWEEP; op = Math.min(1, t / 350); litP = p; }        // sweep, ignite on pass
      else if (t < SWEEP + HOLD)    { p = 1; op = 1; litP = 1; }                                   // hold, all lit
      else if (t < SWEEP + HOLD + FADE) { p = 1; op = 1 - (t - SWEEP - HOLD) / FADE; litP = -1; }  // fade out, dim dots
      else                          { p = 0; op = 0; litP = -1; }                                  // pause / reset
      jGrid.style.setProperty("--jp", p.toFixed(4));
      jGrid.style.setProperty("--jo", op.toFixed(3));
      setLit(litP);
      jraf = requestAnimationFrame(tick);
    };

    const stop = () => { running = false; cancelAnimationFrame(jraf); };
    const start = () => {
      if (running) return;
      measure();
      if (reduce) { jGrid.style.setProperty("--jp", "1"); jGrid.style.setProperty("--jo", "1"); setLit(1); return; }
      if (!desktop.matches) return; // wrapped mobile/tablet layout stays static
      running = true; t0 = performance.now(); jraf = requestAnimationFrame(tick);
    };

    window.addEventListener("resize", () => { if (running) measure(); }, { passive: true });

    if ("IntersectionObserver" in window) {
      const jio = new IntersectionObserver(([e]) => { e.isIntersecting ? start() : stop(); }, { threshold: 0.25 });
      jio.observe(jGrid);
    } else {
      start();
    }
  }
})();
