(() => {
  "use strict";

  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => [...scope.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  // ---------- Loader ----------
  const boot = $("#boot");
  const bootCanvas = $("#bootCanvas");
  const fill = $("#bootFill");
  const pct = $("#bootPct");
  const stage = $("#bootStage");
  const message = $("#bootMessage");
  const steps = $$("[data-boot-step]");

  const phases = [
    { at: 0, label: "Opening identity channel", msg: "Establishing a secure digital handshake.", step: 0 },
    { at: 24, label: "Resolving organization identity", msg: "Loading AutoMinds Africa identity.", step: 0 },
    { at: 48, label: "Opening contact routes", msg: "Preparing direct communication channels.", step: 1 },
    { at: 70, label: "Mapping capability systems", msg: "Connecting AI, Smart Digital Solutions and systems.", step: 2 },
    { at: 91, label: "Optimizing this device", msg: "Finalizing your Smart Digital Profile experience.", step: 3 },
    { at: 100, label: "Identity ready", msg: "Connection established.", step: 3 }
  ];

  function phaseFor(value) {
    return [...phases].reverse().find((item) => value >= item.at) || phases[0];
  }

  function renderBoot(value) {
    const n = Math.max(0, Math.min(100, Math.round(value)));
    if (fill) fill.style.width = n + "%";
    if (pct) pct.textContent = String(n);
    const current = phaseFor(n);
    if (stage) stage.textContent = current.label;
    if (message) message.textContent = current.msg;
    steps.forEach((node, i) => node.classList.toggle("is-active", i <= current.step));
  }

  function bootNetwork() {
    if (!bootCanvas || reduceMotion) return () => {};
    const ctx = bootCanvas.getContext("2d");
    if (!ctx) return () => {};

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let particles = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      bootCanvas.width = Math.round(width * dpr);
      bootCanvas.height = Math.round(height * dpr);
      bootCanvas.style.width = width + "px";
      bootCanvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(22, Math.min(54, Math.round(width / 28)));
      particles = Array.from({ length: count }, (_, i) => ({
        x: (i / count) * width + Math.random() * 30,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.17,
        vy: (Math.random() - 0.5) * 0.17,
        r: Math.random() * 1.4 + 0.6
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.fillStyle = i % 7 === 0 ? "rgba(249,115,22,.7)" : "rgba(107,168,255,.62)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 118) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(115,166,236,${(1 - dist / 118) * 0.16})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }

  function runLoader() {
    if (!boot) return;
    const stopNetwork = bootNetwork();

    let duration = 2400;
    try {
      if (sessionStorage.getItem("ama-profile-loaded") === "1") duration = 900;
      else sessionStorage.setItem("ama-profile-loaded", "1");
    } catch (_) {}

    if (reduceMotion) duration = 0;

    const started = performance.now();

    function done() {
      renderBoot(100);
      setTimeout(() => {
        boot.classList.add("is-leaving");
        stopNetwork();
        setTimeout(() => boot.remove(), reduceMotion ? 0 : 820);
      }, reduceMotion ? 0 : 150);
    }

    if (!duration) {
      done();
      return;
    }

    function frame(now) {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      renderBoot(eased * 100);
      if (t < 1) requestAnimationFrame(frame);
      else done();
    }
    requestAnimationFrame(frame);
  }

  // ---------- Ambient signal network ----------
  const signalCanvas = $("#signalCanvas");
  function ambientNetwork() {
    if (!signalCanvas || reduceMotion) return;
    const ctx = signalCanvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let nodes = [];
    let raf = 0;
    const pointer = { x: -9999, y: -9999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      signalCanvas.width = Math.round(w * dpr);
      signalCanvas.height = Math.round(h * dpr);
      signalCanvas.style.width = w + "px";
      signalCanvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(42, Math.round(w / 38)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - .5) * .08,
        vy: (Math.random() - .5) * .08
      }));
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const pd = Math.hypot(p.x - pointer.x, p.y - pointer.y);
        const boost = pd < 180 ? .72 : .34;

        ctx.beginPath();
        ctx.fillStyle = `rgba(102,160,245,${boost})`;
        ctx.arc(p.x, p.y, pd < 180 ? 1.6 : 1, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j];
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(91,145,224,${(1 - d / 140) * .08})`;
            ctx.lineWidth = .55;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
    }, { passive: true });
    raf = requestAnimationFrame(draw);
  }

  // ---------- Pointer glow ----------
  const glow = $("#cursorGlow");
  if (glow && !reduceMotion) {
    window.addEventListener("pointermove", (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top = e.clientY + "px";
    }, { passive: true });
  }

  // ---------- Tilt ----------
  function initTilt() {
    if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 6}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // ---------- Scroll reveal ----------
  function initReveal() {
    const items = $$(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in-view"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .08, rootMargin: "0px 0px -4% 0px" });
    items.forEach((el) => io.observe(el));
  }

  // ---------- Share / toast ----------
  const toast = $("#toast");
  let toastTimer = 0;
  function showToast(text) {
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  async function copy(value) {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
      return;
    }
    const temp = document.createElement("textarea");
    temp.value = value;
    temp.setAttribute("readonly", "");
    temp.style.position = "fixed";
    temp.style.opacity = "0";
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
  }

  async function shareProfile() {
    const data = {
      title: "AutoMinds Africa — Smart Digital Identity",
      text: "AutoMinds Africa builds AI, Smart Digital Solutions and connected business systems.",
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    try {
      await copy(window.location.href);
      showToast("Profile link copied.");
    } catch (_) {
      showToast("Share is unavailable on this browser.");
    }
  }

  $("#shareBtn")?.addEventListener("click", shareProfile);
  $("#mobileShareBtn")?.addEventListener("click", shareProfile);

  // ---------- Clock / year ----------
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  function setClock() {
    const node = $("#bootClock");
    if (!node) return;
    try {
      const t = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Africa/Kampala",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(new Date());
      node.textContent = "KAMPALA / " + t + " EAT";
    } catch (_) {}
  }
  setClock();

  // ---------- Start ----------
  runLoader();
  ambientNetwork();
  initTilt();
  initReveal();
})();