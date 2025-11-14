// Enhanced animations and interactive effects
class Animations {
  constructor() {
    this.init();
  }

  init() {
    this.initAOS();
    this.initScrollAnimations();
    this.initCounters();
    this.initSkillBars();
    this.initTypingEffect();
    this.initParallax();
    this.initScrollProgress();
  }

  initAOS() {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 800,
        easing: "ease-in-out",
        once: true,
        mirror: false,
        offset: 100,
      });
    }
  }

  initScrollAnimations() {
    const scrollElements = document.querySelectorAll(".scroll-trigger");

    const elementInView = (el, dividend = 1) => {
      const elementTop = el.getBoundingClientRect().top;
      return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) / dividend
      );
    };

    const displayScrollElement = (element) => {
      element.classList.add("visible");
    };

    const handleScrollAnimation = () => {
      scrollElements.forEach((el) => {
        if (elementInView(el, 1.25)) {
          displayScrollElement(el);
        }
      });
    };

    window.addEventListener("scroll", () => {
      handleScrollAnimation();
    });

    // Initial check
    handleScrollAnimation();
  }

  initCounters() {
    const counters = document.querySelectorAll(".stat-number");
    let started = false;

    const startCounters = () => {
      if (started) return;

      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-count"));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            counter.textContent = target + "+";
            clearInterval(timer);
          } else {
            counter.textContent = Math.floor(current) + "+";
          }
        }, 16);
      });

      started = true;
    };

    // Start counters when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector(".hero-stats");
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  initSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");
    let animated = false;

    const animateSkillBars = () => {
      if (animated) return;

      skillBars.forEach((bar) => {
        const width = bar.getAttribute("data-width");
        bar.style.width = width + "%";
      });

      animated = true;
    };

    // Animate when skills section is in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkillBars();
          }
        });
      },
      { threshold: 0.3 }
    );

    const skillsSection = document.querySelector(".skills");
    if (skillsSection) {
      observer.observe(skillsSection);
    }
  }

  initTypingEffect() {
    const animatedTitle = document.querySelector(".animated-title");
    if (!animatedTitle) return;

    const words = [
      "Software Engineer",
      "Full Stack Developer",
      ".NET Developer",
      "Cloud Architect",
      "Enterprise Solutions Architect"
    ];

    // Clear any existing content
    const titleWords = animatedTitle.querySelector(".title-words");
    titleWords.innerHTML = "";

    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let deletingSpeed = 50;
    let pauseTime = 2000;

    const type = () => {
      const currentWord = words[currentWordIndex];

      if (isDeleting) {
        // Deleting text
        titleWords.textContent = currentWord.substring(0, currentCharIndex - 1);
        currentCharIndex--;

        if (currentCharIndex === 0) {
          isDeleting = false;
          currentWordIndex = (currentWordIndex + 1) % words.length;
          setTimeout(type, 500);
        } else {
          setTimeout(type, deletingSpeed);
        }
      } else {
        // Typing text
        titleWords.textContent = currentWord.substring(0, currentCharIndex + 1);
        currentCharIndex++;

        if (currentCharIndex === currentWord.length) {
          isDeleting = true;
          setTimeout(type, pauseTime);
        } else {
          setTimeout(type, typingSpeed);
        }
      }
    };

    // Initialize the typing effect
    setTimeout(type, 1000);
  }

  initParallax() {
    const parallaxElements = document.querySelectorAll(".hero-background");

    const handleParallax = () => {
      const scrolled = window.pageYOffset;

      parallaxElements.forEach((element) => {
        if (Utils.isElementPartiallyInViewport(element)) {
          element.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
      });
    };

    window.addEventListener("scroll", Utils.throttle(handleParallax, 16));
  }

  initScrollProgress() {
    const progressBar = document.createElement("div");
    progressBar.className = "scroll-progress";
    progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--gradient-net);
            z-index: 10000;
            transition: width 0.1s ease;
        `;
    document.body.appendChild(progressBar);

    const updateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight;
      const scrollTop = window.pageYOffset;
      const progress = (scrollTop / documentHeight) * 100;

      progressBar.style.width = progress + "%";
    };

    window.addEventListener("scroll", Utils.throttle(updateProgress, 16));
  }
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Animations();
});
