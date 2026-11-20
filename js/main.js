(function () {
  document.documentElement.classList.remove("no-js");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LETTER_DELAY = 110;
  const CLOCK_SWAP_MS = 5000;
  const STATUS_REFRESH_MS = 60000;
  const SERVER_HOST = "smp.gameknight.kdns.fr";

  /* ---------- Titre animé ---------- */
  function initTitleSweep() {
    const root = document.querySelector("[data-title-letters]");
    if (!root) return;

    const text = root.textContent.trim();
    root.textContent = "";
    const letters = [...text].map((char) => {
      const span = document.createElement("span");
      span.className = "letter";
      span.setAttribute("aria-hidden", "true");
      span.textContent = char;
      root.appendChild(span);
      return span;
    });

    if (!letters.length || reduceMotion) return;

    let index = 0;
    setInterval(() => {
      if (document.hidden) return;
      letters.forEach((letter) => letter.classList.remove("is-shine"));
      letters[index].classList.add("is-shine");
      index = (index + 1) % letters.length;
    }, LETTER_DELAY);
  }

  /* ---------- Horloge ---------- */
  const pad = (value) => String(value).padStart(2, "0");
  const formatTime = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const formatDate = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;

  function initClock() {
    const roots = document.querySelectorAll("[data-clock]");
    if (!roots.length) return;

    let mode = "time";
    let lastSwap = Date.now();

    function tick() {
      const now = new Date();
      if (now.getTime() - lastSwap >= CLOCK_SWAP_MS) {
        mode = mode === "time" ? "date" : "time";
        lastSwap = now.getTime();
      }
      roots.forEach((root) => {
        const label = root.querySelector("[data-clock-label]");
        const value = root.querySelector("[data-clock-value]");
        if (!label || !value) return;
        label.textContent = mode === "time" ? "Heure" : "Date";
        value.textContent = mode === "time" ? formatTime(now) : formatDate(now);
      });
    }

    tick();
    setInterval(tick, 500);
  }

  /* ---------- Toast + copie ---------- */
  let toastTimer;
  function showToast(message) {
    const toast = document.querySelector("[data-toast]");
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    // force un reflow pour relancer la transition
    void toast.offsetWidth;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch (_e) {
        ok = false;
      }
      helper.remove();
      return ok;
    }
  }

  function initCopyButtons() {
    document.addEventListener("click", async (event) => {
      const button = event.target.closest("[data-copy]");
      if (!button) return;
      const value = button.getAttribute("data-copy") || "";
      const ok = await copyText(value);
      showToast(ok ? "Copié : " + value : "Copie impossible, copie manuellement : " + value);
    });
  }

  /* ---------- Navigation ---------- */
  function initNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const links = document.querySelector("[data-nav-links]");
    const wrap = document.querySelector(".nav-wrap");

    function setOpen(open) {
      if (!toggle || !links) return;
      links.classList.toggle("is-open", open);
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    }

    if (toggle && links) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));
      links.addEventListener("click", (e) => {
        if (e.target.closest("a")) setOpen(false);
      });
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
      });
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".nav")) setOpen(false);
      });
      window.addEventListener("resize", () => {
        if (window.innerWidth > 980) setOpen(false);
      });
    }

    if (wrap) {
      const onScroll = () => wrap.classList.toggle("is-scrolled", window.scrollY > 10);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------- Apparition au scroll ---------- */
  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Compteurs animés ---------- */
  function animateNumber(el, target) {
    if (reduceMotion || !Number.isFinite(target)) {
      el.textContent = String(target);
      return;
    }
    const start = Number(el.textContent) || 0;
    const duration = 900;
    const t0 = performance.now();
    function frame(now) {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Statut du serveur ---------- */
  function initStatus() {
    const dots = document.querySelectorAll("[data-status-dot]");
    const texts = document.querySelectorAll("[data-status-text]");
    const counts = document.querySelectorAll("[data-players-online]");
    const maxes = document.querySelectorAll("[data-players-max]");
    if (!dots.length && !texts.length && !counts.length) return;

    async function refresh() {
      try {
        const res = await fetch("https://api.mcsrvstat.us/3/" + SERVER_HOST, { cache: "no-store" });
        if (!res.ok) throw new Error("status " + res.status);
        const json = await res.json();
        const data = {
          online: Boolean(json.online),
          players: {
            online: (json.players && json.players.online) || 0,
            max: (json.players && json.players.max) || 0,
          },
        };
        const online = data.online;
        dots.forEach((d) => {
          d.classList.toggle("is-online", online);
          d.classList.toggle("is-offline", !online);
        });
        texts.forEach((t) => {
          t.textContent = online
            ? `${data.players.online} joueur${data.players.online > 1 ? "s" : ""} en ligne`
            : "Serveur hors ligne";
        });
        counts.forEach((c) => animateNumber(c, online ? data.players.online : 0));
        maxes.forEach((m) => {
          m.textContent = online && data.players.max ? String(data.players.max) : "—";
        });
      } catch (_error) {
        dots.forEach((d) => d.classList.remove("is-online"));
        texts.forEach((t) => (t.textContent = "Statut indisponible"));
      }
    }

    refresh();
    setInterval(() => {
      if (!document.hidden) refresh();
    }, STATUS_REFRESH_MS);
  }

  /* ---------- Braises en fond ---------- */
  function initEmbers() {
    const canvas = document.getElementById("embers");
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let particles = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(70, Math.round((w * h) / 24000));
      particles = Array.from({ length: count }, () => spawn(true));
    }

    function spawn(randomY) {
      return {
        x: Math.random() * w,
        y: randomY ? Math.random() * h : h + 10,
        r: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.3,
        a: Math.random() * 0.6 + 0.2,
        hue: Math.random() * 30 + 10,
      };
    }

    function frame() {
      if (!document.hidden) {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p, i) => {
          p.y -= p.vy;
          p.x += p.vx + Math.sin(p.y / 60) * 0.15;
          if (p.y < -10) particles[i] = spawn(false);
          ctx.beginPath();
          ctx.fillStyle = `hsla(${p.hue}, 100%, 60%, ${p.a})`;
          ctx.shadowColor = `hsla(${p.hue}, 100%, 55%, 0.8)`;
          ctx.shadowBlur = 8;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
  }

  initTitleSweep();
  initClock();
  initCopyButtons();
  initNav();
  initReveal();
  initStatus();
  initEmbers();

  window.GK = { showToast };
})();
