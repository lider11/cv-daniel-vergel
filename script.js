(() => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Abrir menú");
      });
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

  // Active nav on scroll
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".nav a")];

  const setActiveLink = () => {
    const y = window.scrollY + 100;
    let current = sections[0]?.id;
    for (const section of sections) {
      if (section.offsetTop <= y) current = section.id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute("href")?.slice(1);
      link.classList.toggle("active", href === current);
    });
  };

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  // Reveal on scroll
  const revealTargets = document.querySelectorAll(
    ".panel, .timeline-item, .edu-card, .cert-group, .skill-card, .contact-card, .hero-content, .hero-aside, .avatar-panel, .hero-card, .service-card, .achievement-card, .language-card, .map-wrap"
  );
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
