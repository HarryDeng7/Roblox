/* Roblox Build Day — site interactions (shared by all pages) */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initCountdown();
  initShapes();
  initReveal();
  initFaq();
  initForm();
  initTabs();
  initCounters();
});

/* ------------------------------------------------------------
   Mobile navigation
   ------------------------------------------------------------ */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  if (toggle && links) {
    const close = () => {
      links.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Close the menu when a link is chosen
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", close);
    });

    // Close the menu with Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  // Header shadow on scroll
  const header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      () => header.classList.toggle("scrolled", window.scrollY > 8),
      { passive: true }
    );
  }
}

/* ------------------------------------------------------------
   Countdown to the next Build Day (Build Day page only)
   ------------------------------------------------------------ */
function initCountdown() {
  // Next Build Day: Monday, September 28, 2026 at 9:00 AM
  const eventDate = new Date("2026-09-28T09:00:00");
  const label = document.getElementById("countdownLabel");
  const els = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    mins: document.getElementById("cdMins"),
    secs: document.getElementById("cdSecs"),
  };

  if (!label || !els.days || !els.hours || !els.mins || !els.secs) return;

  const pad = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const diff = eventDate - Date.now();

    if (diff <= 0) {
      label.textContent = "Build Day is live — go build!";
      els.days.textContent = els.hours.textContent = els.mins.textContent = els.secs.textContent = "00";
      clearInterval(timer);
      return;
    }

    els.days.textContent = pad(Math.floor(diff / 86400000));
    els.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
    els.mins.textContent = pad(Math.floor(diff / 60000) % 60);
    els.secs.textContent = pad(Math.floor(diff / 1000) % 60);
  };

  tick();
  const timer = setInterval(tick, 1000);
}

/* ------------------------------------------------------------
   Floating blocky shapes in the hero
   ------------------------------------------------------------ */
function initShapes() {
  const holder = document.getElementById("heroShapes");
  if (!holder || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const colors = [
    "rgba(226,35,26,0.32)",
    "rgba(255,255,255,0.13)",
    "rgba(245,197,24,0.17)",
    "rgba(226,35,26,0.15)",
    "rgba(255,255,255,0.07)",
    "rgba(226,35,26,0.24)",
  ];

  const kinds = ["sh-square", "sh-circle", "sh-rot", "sh-long", "sh-circle", "sh-square", "sh-rot"];

  for (let i = 0; i < 16; i++) {
    const shape = document.createElement("div");
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    shape.className = `shape ${kind}`;

    const color = colors[Math.floor(Math.random() * colors.length)];
    const isLong = kind === "sh-long";
    const w = isLong ? 60 + Math.random() * 70 : 14 + Math.random() * 38;
    const h = isLong ? 16 + Math.random() * 14 : w;

    shape.style.left = `${Math.random() * 92}%`;
    shape.style.top = `${6 + Math.random() * 76}%`;
    shape.style.width = `${w}px`;
    shape.style.height = `${h}px`;
    shape.style.background = color;

    const duration = 7 + Math.random() * 7;
    const delay = -Math.random() * 10;
    shape.style.animation = `floaty ${duration}s ease-in-out ${delay}s infinite alternate`;

    holder.appendChild(shape);
  }
}

/* ------------------------------------------------------------
   Scroll reveal animations
   ------------------------------------------------------------ */
function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  // Staggered delays inside .stagger parents
  document.querySelectorAll(".stagger").forEach((parent) => {
    Array.from(parent.children).forEach((child, i) => {
      if (child.classList.contains("reveal")) {
        child.style.transitionDelay = `${i * 0.09}s`;
      }
    });
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          // Clear the stagger delay once the reveal finishes so hover
          // transitions are never delayed.
          entry.target.addEventListener(
            "transitionend",
            () => (entry.target.style.transitionDelay = ""),
            { once: true }
          );
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------
   FAQ accordion
   ------------------------------------------------------------ */
function initFaq() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      // Close any other open item
      document.querySelectorAll(".faq-item.open").forEach((other) => {
        other.classList.remove("open");
        other.querySelector(".faq-answer").style.maxHeight = null;
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ------------------------------------------------------------
   Signup form (demo, Build Day page only)
   ------------------------------------------------------------ */
function initForm() {
  const form = document.getElementById("signupForm");
  const success = document.getElementById("formSuccess");
  if (!form || !success) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.style.display = "none";
    success.hidden = false;
  });
}

/* ------------------------------------------------------------
   Tabs (both pages: how Roblox works + experience genres)
   ------------------------------------------------------------ */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const btns = Array.from(tabs.querySelectorAll(".tab-btn"));
    const panels = Array.from(tabs.querySelectorAll(".tab-panel"));
    if (!btns.length || !panels.length) return;

    const activate = (name) => {
      btns.forEach((b) => {
        const on = b.dataset.tab === name;
        b.classList.toggle("active", on);
        b.setAttribute("aria-selected", String(on));
      });
      panels.forEach((p) => {
        const on = p.dataset.panel === name;
        p.classList.toggle("active", on);
        p.hidden = !on;
      });
    };

    btns.forEach((btn) => {
      btn.addEventListener("click", () => activate(btn.dataset.tab));
    });

    // Arrow-key navigation for keyboard users
    const list = tabs.querySelector(".tab-list");
    if (list) {
      list.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        const idx = btns.indexOf(document.activeElement);
        if (idx === -1) return;
        e.preventDefault();
        const next =
          e.key === "ArrowRight"
            ? btns[(idx + 1) % btns.length]
            : btns[(idx - 1 + btns.length) % btns.length];
        next.focus();
        activate(next.dataset.tab);
      });
    }

    // Start in a consistent state
    const initial = btns.find((b) => b.classList.contains("active")) || btns[0];
    activate(initial.dataset.tab);
  });
}

/* ------------------------------------------------------------
   Count-up numbers (Roblox in numbers band)
   ------------------------------------------------------------ */
function initCounters() {
  const nums = document.querySelectorAll("[data-count]");
  if (!nums.length) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const run = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;

    if (reduced) {
      el.textContent = String(target);
      return;
    }

    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(step);
    };

    el.textContent = "0";
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  nums.forEach((el) => io.observe(el));
}
