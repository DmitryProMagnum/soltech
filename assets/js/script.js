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
  const SOLAR_RATE = 0.11;
  const slider   = $("#billSlider");
  const billVal  = $("#billVal");
  const dewaRate = $("#dewaRate");
  const cutPct   = $("#cutPct");
  const saveVal  = $("#saveVal");
  const payback  = $("#paybackVal");
  const lowNote  = $("#lowNote");
  const reportCta = $("#reportCta");

  function compute(bill) {
    const rate = clamp(0.36 + bill / 40000, 0.38, 0.46);
    const kwh  = bill / rate;
    const save = kwh * 12 * 0.85 * (rate - SOLAR_RATE);
    const capex = (kwh * 0.85 / 155) * 4000;
    return { rate, save, payback: capex / save };
  }

  let disp = null, raf = 0;

  function paint(bill, d) {
    billVal.textContent  = bill.toLocaleString("en-US");
    dewaRate.textContent = d.rate.toFixed(2);
    cutPct.textContent   = Math.round((1 - SOLAR_RATE / d.rate) * 100);
    saveVal.textContent  = (Math.round(d.save / 100) * 100).toLocaleString("en-US");
    payback.textContent  = d.payback.toFixed(1);
  }

  function setSliderFill(bill) {
    const pct = (bill - 500) / 19500 * 100;
    slider.style.background =
      `linear-gradient(90deg, var(--accent) ${pct}%, rgba(255,255,255,.18) ${pct}%)`;
  }

  function setLowNote(bill) {
    if (bill < 1500) lowNote.removeAttribute("hidden");
    else lowNote.setAttribute("hidden", "");
  }

  function setReportHref(bill) {
    reportCta.href =
      "https://wa.me/971500000000?text=" +
      encodeURIComponent(`Hi SolTech, please send my full savings report. My monthly bill is about ${bill} AED`);
  }

  function onBill() {
    const bill = +slider.value;
    const from = { ...(disp || compute(bill)) };
    const to = compute(bill);
    setSliderFill(bill);
    setLowNote(bill);
    setReportHref(bill);

    if (reduce) { disp = to; paint(bill, to); return; }

    cancelAnimationFrame(raf);
    const t0 = performance.now(), dur = 380;
    (function step(now) {
      const p = clamp((now - t0) / dur, 0, 1), e = easeOutCubic(p);
      disp = {
        rate:    from.rate    + (to.rate    - from.rate)    * e,
        save:    from.save    + (to.save    - from.save)    * e,
        payback: from.payback + (to.payback - from.payback) * e,
      };
      paint(bill, disp);
      if (p < 1) raf = requestAnimationFrame(step);
    })(t0);
  }

  if (slider) {
    const init = +slider.value;
    disp = compute(init);
    paint(init, disp);
    setSliderFill(init);
    setLowNote(init);
    setReportHref(init);
    slider.addEventListener("input", onBill);
    slider.addEventListener("change", onBill);
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
     Hero video: honor reduced-motion, a manual pause/play control (WCAG 2.2.2),
     and pause when off-screen (perf / battery).
     ============================================================ */
  const heroVideo = $(".hero__video");
  const mediaCtrl = $("#heroMediaCtrl");
  if (heroVideo) {
    let userPaused = reduce; // reduced-motion users start paused (poster shown)
    const tryPlay = () => { const p = heroVideo.play(); if (p && p.catch) p.catch(() => {}); };

    const setCtrl = (paused) => {
      if (!mediaCtrl) return;
      mediaCtrl.classList.toggle("is-paused", paused);
      mediaCtrl.setAttribute("aria-label", paused ? "Play background video" : "Pause background video");
    };

    if (reduce) { heroVideo.removeAttribute("autoplay"); heroVideo.pause(); }
    setCtrl(userPaused);

    if (mediaCtrl) {
      mediaCtrl.addEventListener("click", () => {
        userPaused = !userPaused;
        if (userPaused) heroVideo.pause();
        else tryPlay();
        setCtrl(userPaused);
      });
    }

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
