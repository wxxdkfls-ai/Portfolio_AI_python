/* =========================================================
   정아린 · Arin Jung — interactions
   ========================================================= */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------- Header state ---------- */
  const header = document.querySelector(".site-header");

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("nav");

  const setNav = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  };

  toggle.addEventListener("click", () => {
    setNav(toggle.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNav(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNav(false);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) setNav(false);
  });

  /* ---------- Active section in navigation ---------- */
  const navLinks = Array.from(nav.querySelectorAll("a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", isActive);
            if (isActive) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll("[data-reveal]");

  if (!prefersReduced && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = el.dataset.delay;
          if (delay) el.style.transitionDelay = delay + "ms";
          el.classList.add("is-visible");
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    revealItems.forEach((el) => revealObserver.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copyEmail");

  if (copyBtn) {
    const defaultLabel = copyBtn.textContent.trim();
    let resetTimer;

    const flash = (message) => {
      copyBtn.textContent = message;
      window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(() => {
        copyBtn.textContent = defaultLabel;
      }, 2000);
    };

    copyBtn.addEventListener("click", async () => {
      const email = copyBtn.dataset.email;

      const legacyCopy = () => {
        const field = document.createElement("textarea");
        field.value = email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(field);
        return ok;
      };

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          flash("복사되었습니다 ✓");
          return;
        }
        if (legacyCopy()) {
          flash("복사되었습니다 ✓");
          return;
        }
        flash("복사에 실패했어요");
      } catch (error) {
        try {
          if (legacyCopy()) {
            flash("복사되었습니다 ✓");
            return;
          }
        } catch (fallbackError) {
          /* noop */
        }
        flash("복사에 실패했어요");
      }
    });
  }

  /* ---------- Year ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
