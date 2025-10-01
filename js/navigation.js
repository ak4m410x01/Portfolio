// Enhanced Navigation functionality
class Navigation {
  constructor() {
    this.navbar = document.getElementById("navbar");
    this.navMenu = document.getElementById("navMenu");
    this.navToggle = document.getElementById("navToggle");
    this.navLinks = document.querySelectorAll(".nav-link");
    this.themeToggle = document.getElementById("themeToggle");
    this.init();
  }

  init() {
    this.initMobileMenu();
    this.initScrollEffects();
    this.initActiveLinks();
    this.initThemeToggle();
    this.initSmoothScroll();
  }

  initMobileMenu() {
    if (this.navToggle) {
      this.navToggle.addEventListener("click", () => {
        this.navMenu.classList.toggle("active");
        this.navToggle.classList.toggle("active");

        // Toggle aria-expanded
        const isExpanded = this.navMenu.classList.contains("active");
        this.navToggle.setAttribute("aria-expanded", isExpanded);
      });
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        this.navMenu.classList.remove("active");
        this.navToggle.classList.remove("active");
        this.navToggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !this.navbar.contains(e.target) &&
        this.navMenu.classList.contains("active")
      ) {
        this.navMenu.classList.remove("active");
        this.navToggle.classList.remove("active");
        this.navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  initScrollEffects() {
    let lastScrollY = window.scrollY;

    const handleScroll = Utils.throttle(() => {
      // Navbar background on scroll
      if (window.scrollY > 100) {
        this.navbar.classList.add("nav-scrolled");
      } else {
        this.navbar.classList.remove("nav-scrolled");
      }

      // Hide/show navbar on scroll
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        this.navbar.style.transform = "translateY(-100%)";
      } else {
        this.navbar.style.transform = "translateY(0)";
      }

      lastScrollY = window.scrollY;
    }, 100);

    window.addEventListener("scroll", handleScroll);
  }

  initActiveLinks() {
    const updateActiveLink = Utils.throttle(() => {
      let current = "";
      const sections = document.querySelectorAll("section");
      const scrollPos = window.scrollY + 100;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          current = section.getAttribute("id");
        }
      });

      this.navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    }, 100);

    window.addEventListener("scroll", updateActiveLink);
    updateActiveLink(); // Initial call
  }

  initThemeToggle() {
    if (!this.themeToggle) return;

    // Load saved theme or default to light
    const savedTheme = localStorage.getItem("theme") || "light";
    this.setTheme(savedTheme);

    this.themeToggle.addEventListener("click", () => {
      const currentTheme = document.body.classList.contains("dark-theme")
        ? "dark"
        : "light";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      this.setTheme(newTheme);

      // Track theme change
      this.trackThemeChange(newTheme);
    });

    // Add system theme preference detection
    this.detectSystemTheme();
  }

  setTheme(theme) {
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      this.themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      this.themeToggle.setAttribute("aria-label", "Switch to light theme");
      this.themeToggle.setAttribute("title", "Switch to light theme");
    } else {
      document.body.classList.remove("dark-theme");
      this.themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      this.themeToggle.setAttribute("aria-label", "Switch to dark theme");
      this.themeToggle.setAttribute("title", "Switch to dark theme");
    }
    localStorage.setItem("theme", theme);

    // Update meta theme color for mobile browsers
    this.updateMetaThemeColor(theme);

    // Dispatch custom event for theme change
    const themeChangeEvent = new CustomEvent("themeChanged", {
      detail: { theme: theme },
    });
    document.dispatchEvent(themeChangeEvent);
  }

  detectSystemTheme() {
    // Check if user prefers dark mode
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        this.setTheme("dark");
      }
    }

    // Listen for system theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const savedTheme = localStorage.getItem("theme");
        if (!savedTheme) {
          // Only auto-switch if user hasn't manually set a theme
          this.setTheme(e.matches ? "dark" : "light");
        }
      });
  }

  updateMetaThemeColor(theme) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta");
      metaThemeColor.name = "theme-color";
      document.head.appendChild(metaThemeColor);
    }

    if (theme === "dark") {
      metaThemeColor.content = "#0f172a"; // Dark theme color
    } else {
      metaThemeColor.content = "#2563eb"; // Primary color for light theme
    }
  }

  trackThemeChange(theme) {
    // You can add analytics tracking here
    console.log(`Theme changed to: ${theme}`);

    // Example: Google Analytics tracking
    if (typeof gtag !== "undefined") {
      gtag("event", "theme_change", {
        event_category: "preferences",
        event_label: theme,
      });
    }
  }

  initSmoothScroll() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = link.getAttribute("href");
        if (targetId === "#") return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          Utils.smoothScrollTo(targetElement, 800);
        }
      });
    });

    // Smooth scroll for back to top
    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
      backToTop.addEventListener("click", (e) => {
        e.preventDefault();
        Utils.smoothScrollTo(document.body, 800);
      });
    }
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Navigation();
});
