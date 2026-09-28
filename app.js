(() => {
  "use strict";

  const loader = document.getElementById("loader");
  const loaderText = document.getElementById("loaderText");
  const shareBtn = document.getElementById("shareBtn");
  const mobileShareBtn = document.getElementById("mobileShareBtn");
  const year = document.getElementById("year");
  const toast = document.getElementById("toast");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const messages = ["CHANGE IS HERE.", "WORK SMARTER. NOT HARDER."];
  let messageIndex = 0;
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2100);
  }

  async function copyText(value) {
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
      title: "AutoMinds Africa — Smart Digital Profile",
      text: "AutoMinds Africa — Change Is Here. Work Smarter. Not Harder.",
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        if (error && error.name === "AbortError") return;
      }
    }

    try {
      await copyText(window.location.href);
      showToast("Profile link copied.");
    } catch (_) {
      showToast("Sharing is unavailable on this browser.");
    }
  }

  function startLoader() {
    if (!loader) return;

    const interval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      if (loaderText) loaderText.textContent = messages[messageIndex];
    }, 850);

    setTimeout(() => {
      clearInterval(interval);
      loader.classList.add("is-hidden");
      setTimeout(() => loader.remove(), 500);
    }, reduceMotion ? 300 : 2500);
  }

  if (shareBtn) shareBtn.addEventListener("click", shareProfile);
  if (mobileShareBtn) mobileShareBtn.addEventListener("click", shareProfile);
  if (year) year.textContent = String(new Date().getFullYear());

  startLoader();
})();