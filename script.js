(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile nav
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  const header = document.getElementById("site-header");

  const setNavOpen = (open) => {
    if (!nav || !toggle) return;
    nav.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      setNavOpen(!nav.classList.contains("open"));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setNavOpen(false);
    });
  }

  // Print (fallback si no se usa el PDF descargable)
  const printBtn = document.getElementById("btn-print");
  if (printBtn) {
    printBtn.addEventListener("click", () => window.print());
  }

  // Si el PDF aún no está en el servidor (404), ofrecer imprimir/guardar PDF
  document.querySelectorAll("a.btn-download, a.contact-download").forEach((link) => {
    link.addEventListener("click", async (event) => {
      const href = link.getAttribute("href");
      if (!href || !href.endsWith(".pdf")) return;
      try {
        const res = await fetch(href, { method: "HEAD", cache: "no-store" });
        if (!res.ok) {
          event.preventDefault();
          window.print();
        }
      } catch {
        // En file:// o sin red, dejar que el navegador maneje el enlace
      }
    });
  });

  // Active nav on scroll + header state + progress + back-to-top
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav a")];
  const progress = document.getElementById("header-progress");
  const backTop = document.getElementById("back-top");

  const onScroll = () => {
    const y = window.scrollY;
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
    const pct = Math.min(100, Math.max(0, (y / max) * 100));

    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (progress) progress.style.width = `${pct}%`;
    if (backTop) backTop.classList.toggle("is-visible", y > 420);

    let current = sections[0]?.id;
    const marker = y + 100;
    for (const section of sections) {
      if (section.offsetTop <= marker) current = section.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", href === current);
    });
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });
  }

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    ".panel, .timeline-item, .edu-card, .cert-group, .skill-card, .contact-card, .hero-content, .hero-aside, .avatar-panel, .hero-card, .service-card, .achievement-card, .language-card, .map-wrap"
  );

  if (reduceMotion) {
    revealTargets.forEach((el) => el.classList.add("visible"));
    return;
  }

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("visible"));
  }
})();
