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

    const words = ["Software Engineer", "Full Stack Developer"];

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

    // Update cursor color based on theme
    this.updateCursorColor();

    // Update cursor color when theme changes
    document.addEventListener("themeChanged", () => {
      this.updateCursorColor();
    });
  }

  updateCursorColor() {
    const cursor = document.querySelector(".animated-cursor");
    if (!cursor) return;

    const isDarkTheme = document.body.classList.contains("dark-theme");

    if (isDarkTheme) {
      cursor.style.color = "#3b82f6"; // Light blue for dark theme
    } else {
      cursor.style.color = "#1d4ed8"; // Dark blue for light theme
    }
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
            background: linear-gradient(90deg, var(--primary), var(--secondary));
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

  // Particle system for hero section (optional enhancement)
  initParticleSystem() {
    const heroSection = document.querySelector(".hero");
    if (!heroSection) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
    heroSection.appendChild(canvas);

    let particles = [];
    const particleCount = 30;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
          color: `rgba(59, 130, 246, ${Math.random() * 0.3})`,
        });
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x > canvas.width || particle.x < 0) particle.speedX *= -1;
        if (particle.y > canvas.height || particle.y < 0) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    };

    // Initialize
    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    resizeCanvas();
    createParticles();
    animateParticles();
  }
}

// Initialize animations when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new Animations();
});
