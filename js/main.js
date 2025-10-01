// Main application initialization
class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.initLoadingScreen();
    this.initApp();
    this.bindEvents();
  }

  initLoadingScreen() {
    const loadingScreen = document.getElementById("loadingScreen");

    // Simulate loading time
    setTimeout(() => {
      loadingScreen.style.opacity = "0";
      setTimeout(() => {
        loadingScreen.style.display = "none";
      }, 500);
    }, 1500);
  }

  initApp() {
    // Update copyright year
    this.updateCopyrightYear();

    // Initialize all components
    this.initExternalLinks();
    this.initImageOptimizations();
    this.initPerformanceOptimizations();
  }

  updateCopyrightYear() {
    const copyrightElements = document.querySelectorAll(".footer-copyright p");
    const currentYear = Utils.getCurrentYear();

    copyrightElements.forEach((element) => {
      if (element.textContent.includes("2024")) {
        element.textContent = element.textContent.replace("2024", currentYear);
      }
    });
  }

  initExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]');

    externalLinks.forEach((link) => {
      if (link.hostname !== window.location.hostname) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");

        // Add external link icon
        if (!link.querySelector(".fa-external-link-alt")) {
          const icon = document.createElement("i");
          icon.className = "fas fa-external-link-alt";
          icon.style.marginLeft = "5px";
          icon.style.fontSize = "0.8em";
          link.appendChild(icon);
        }
      }
    });
  }

  initImageOptimizations() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      // Add loading lazy for better performance
      if (!img.getAttribute("loading")) {
        img.setAttribute("loading", "lazy");
      }

      // Add error handling
      img.addEventListener("error", () => {
        console.warn("Image failed to load:", img.src);
        img.style.display = "none";
      });
    });
  }

  initPerformanceOptimizations() {
    // Preload critical resources
    this.preloadCriticalResources();

    // Initialize service worker (if available)
    this.initServiceWorker();
  }

  preloadCriticalResources() {
    const criticalResources = [
      // Add paths to critical CSS, fonts, or images here
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = resource;
      link.as = resource.includes(".css")
        ? "style"
        : resource.includes(".woff")
        ? "font"
        : "image";
      document.head.appendChild(link);
    });
  }

  async initServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        // You can register a service worker here for offline functionality
        // await navigator.serviceWorker.register('/sw.js');
      } catch (error) {
        console.log("Service Worker registration failed:", error);
      }
    }
  }

  bindEvents() {
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      // Escape key closes mobile menu
      if (e.key === "Escape") {
        const mobileMenu = document.querySelector(".nav-menu.active");
        if (mobileMenu) {
          mobileMenu.classList.remove("active");
          const navToggle = document.getElementById("navToggle");
          if (navToggle) {
            navToggle.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");
          }
        }
      }
    });

    // Performance monitoring
    this.monitorPerformance();
  }

  monitorPerformance() {
    // Monitor long tasks
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            console.warn("Long task detected:", entry);
          }
        }
      });

      observer.observe({ entryTypes: ["longtask"] });
    }

    // Monitor largest contentful paint
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log("LCP:", lastEntry.startTime);
      });

      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    }
  }

  // Utility method for tracking analytics
  trackEvent(category, action, label) {
    if (typeof gtag !== "undefined") {
      gtag("event", action, {
        event_category: category,
        event_label: label,
      });
    }
  }
}

// Initialize the main application
document.addEventListener("DOMContentLoaded", () => {
  window.PortfolioApp = new PortfolioApp();

  // Track page view
  if (typeof gtag !== "undefined") {
    gtag("config", "GA_MEASUREMENT_ID", {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
});

// Error boundary for the application
window.addEventListener("error", (event) => {
  console.error("Application error:", event.error);

  // You can send errors to your error tracking service here
  // Example: Sentry, LogRocket, etc.
});

// Export for global access
window.PortfolioApp = PortfolioApp;
