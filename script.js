(() => {
  "use strict";

  const body = document.body;
  const header = document.querySelector(".site-header");
  const menu = document.querySelector(".nav-menu");
  const menuToggle = document.querySelector(".menu-toggle");
  const progress = document.querySelector(".scroll-progress span");
  const languageButtons = [...document.querySelectorAll("[data-language-button]")];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const publications = [...document.querySelectorAll(".publication")];
  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = [...document.querySelectorAll("main section[id]")];

  function getSavedLanguage() {
    try {
      return localStorage.getItem("rui-ma-language");
    } catch {
      return null;
    }
  }

  function saveLanguage(language) {
    try {
      localStorage.setItem("rui-ma-language", language);
    } catch {
      // The language switch still works when storage is unavailable.
    }
  }

  function setLanguage(language) {
    const nextLanguage = language === "zh" ? "zh" : "en";
    document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
    body.dataset.language = nextLanguage;
    languageButtons.forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.languageButton === nextLanguage),
      );
    });
    saveLanguage(nextLanguage);
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.languageButton));
  });

  const initialLanguage =
    getSavedLanguage() || (navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en");
  setLanguage(initialLanguage);

  function setMenuOpen(open) {
    if (!menu || !menuToggle) return;
    menu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
  }

  menuToggle?.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!menu?.classList.contains("is-open")) return;
    if (menu.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuOpen(false);
  });

  function filterPublications(type) {
    const selectedType = ["journal", "conference"].includes(type) ? type : "all";
    publications.forEach((paper) => {
      paper.hidden = selectedType !== "all" && paper.dataset.type !== selectedType;
    });
    filterButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.filter === selectedType));
    });
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => filterPublications(button.dataset.filter));
  });

  function updateScrollState() {
    const scrollTop = window.scrollY;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(scrollTop / scrollable, 1) : 0;
    if (progress) progress.style.width = `${ratio * 100}%`;
    header?.classList.toggle("is-scrolled", scrollTop > 16);
  }

  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.09, rootMargin: "0px 0px -36px" },
    );

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.hash === `#${visible.target.id}`);
        });
      },
      { rootMargin: "-30% 0px -58%", threshold: [0.02, 0.2, 0.5] },
    );

    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    document.querySelectorAll(".reveal").forEach((element) => {
      element.classList.add("is-visible");
    });
  }

  const scholarCitationCount = document.querySelector("#scholar-citations-count");
  if (scholarCitationCount) {
    fetch("assets/scholar-stats.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Scholar statistics are unavailable");
        return response.json();
      })
      .then((stats) => {
        const citations = Number(stats.citations);
        if (!Number.isInteger(citations) || citations < 0) return;
        scholarCitationCount.textContent = citations.toLocaleString("en-US");
        if (typeof stats.updatedAt === "string") {
          scholarCitationCount.dataset.updatedAt = stats.updatedAt;
        }
      })
      .catch(() => {
        // Keep the server-rendered fallback when the weekly data file is unavailable.
      });
  }

  const currentYear = document.querySelector("#current-year");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();
