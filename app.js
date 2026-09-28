(() => {
  "use strict";

  const boot = document.getElementById("boot");
  const fill = document.getElementById("bootFill");
  const pct = document.getElementById("bootPct");
  const stage = document.getElementById("bootStage");
  const message = document.getElementById("bootMessage");
  const systemSteps = [...document.querySelectorAll(".boot__systems > div")];

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const stages = [
    { at: 0, text: "Initializing profile", message: "Opening your smart digital connection.", step: 0 },
    { at: 24, text: "Loading identity", message: "Loading AutoMinds Africa identity.", step: 0 },
    { at: 48, text: "Connecting contact routes", message: "Preparing direct contact actions.", step: 1 },
    { at: 70, text: "Mapping capabilities", message: "Loading AI, systems and Smart Digital Solutions.", step: 2 },
    { at: 91, text: "Final interface check", message: "Optimizing the experience for this device.", step: 3 },
    { at: 100, text: "Profile ready", message: "Connection ready.", step: 3 }
  ];

  function updateBoot(value) {
    const safe = Math.max(0, Math.min(100, Math.round(value)));
    if (fill) fill.style.width = safe + "%";
    if (pct) pct.textContent = String(safe);

    const current = [...stages].reverse().find((item) => safe >= item.at) || stages[0];
    if (stage) stage.textContent = current.text;
    if (message) message.textContent = current.message;

    systemSteps.forEach((item, index) => {
      item.classList.toggle("is-active", index <= current.step);
    });
  }

  function closeBoot() {
    if (!boot) return;
    updateBoot(100);
    window.setTimeout(() => {
      boot.classList.add("is-leaving");
      document.documentElement.classList.remove("is-booting");
      window.setTimeout(() => boot.remove(), prefersReducedMotion ? 0 : 760);
    }, prefersReducedMotion ? 0 : 120);
  }

  function runBoot() {
    if (!boot) return;

    document.documentElement.classList.add("is-booting");

    if (prefersReducedMotion) {
      closeBoot();
      return;
    }

    let duration = 1850;
    try {
      if (sessionStorage.getItem("autominds-smart-profile-seen") === "1") {
        duration = 720;
      } else {
        sessionStorage.setItem("autominds-smart-profile-seen", "1");
      }
    } catch (_) {
      // Session storage is optional; the profile still works without it.
    }

    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      updateBoot(eased * 100);

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        closeBoot();
      }
    }

    requestAnimationFrame(frame);
  }

  function showToast(text) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = text;
    toast.classList.add("is-visible");

    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2200);
  }

  async function copyText(value, successMessage) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const input = document.createElement("textarea");
        input.value = value;
        input.setAttribute("readonly", "");
        input.style.position = "fixed";
        input.style.opacity = "0";
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        input.remove();
      }
      showToast(successMessage);
      return true;
    } catch (_) {
      showToast("Copy was blocked by your browser.");
      return false;
    }
  }

  const copyBtn = document.getElementById("copyBtn");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const value = copyBtn.dataset.copy || "+256783025667";
      const ok = await copyText(value, "Phone number copied.");
      const label = document.getElementById("copyLabel");
      if (ok && label) {
        const original = label.textContent;
        label.textContent = "Copied. Ready to paste.";
        window.setTimeout(() => {
          label.textContent = original;
        }, 2200);
      }
    });
  }

  const shareBtn = document.getElementById("shareBtn");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: "AutoMinds Africa",
        text: "AutoMinds Africa — AI, Smart Digital Solutions and systems that make businesses move.",
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (error) {
          if (error && error.name === "AbortError") return;
        }
      }

      await copyText(window.location.href, "Profile link copied.");
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  runBoot();
})();
