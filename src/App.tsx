import { useState, useEffect, useRef } from "react";

import "./App.css";
import "./responsive.css";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {
  /* =======================
==========================
LENIS
==========================
========================== */

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  /* =======================
==========================
CONST AND STATE DECLARATIONS
==========================
========================== */

  const [isMenuActive, setIsMenuActive] = useState(false); // Always start with menu closed
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };


  /* =======================
==========================
PAGE TRANSITION LOGIC
==========================
========================== */

  useEffect(() => {
    const isTransitioning = sessionStorage.getItem("pageTransition");
    if (isTransitioning === "true") {
      sessionStorage.removeItem("pageTransition");

      // Hold at full screen for a short delay (already at full screen from initial state)
      setTimeout(() => {
        // Return to original shape
        setIsPageTransition(false);
        setIsReturning(true);

        // Short delay after returning to original shape
        setTimeout(() => {
          // Close menu (return to button)
          setIsReturning(false);
          setIsMenuActive(false);
        }, 900);
      }, 800);
    }
  }, []);

  /* =======================
==========================
IMAGE TRAILING HOVER EFFECT
==========================
========================== */

  useEffect(() => {
    const container = heroContainerRef.current;
    if (!container) return;

    const config = {
      imageCount: 15,
      imageLifespan: 750,
      removalDelay: 50,
      mouseThreshold: 100,
      scrollThreshold: 100,
      idleCursorInterval: 1000,
      inDuration: 750,
      outDuration: 1000,
      inEasing: "cubic-bezier(.07, .5, .5, 1)",
      outEasing: "cubic-bezier(.8, 0, .15, 1)"
    };

    const images = Array.from({ length: config.imageCount }, (_, i) => 
      `/circle${(i % 6) + 1}.jpg`
    );

    const trail: Array<{
      element: HTMLImageElement;
      rotation: number;
      removeTime: number;
    }> = [];

    let mouseX = 0, mouseY = 0, lastMouseX = 0, lastMouseY = 0;
    let isMoving = false;
    let isCursorInContainer = false;
    let lastRemovalTime = 0;
    let lastSteadyImageTime = 0;
    let lastScrollTime = 0;
    let isScrolling = false;
    let scrollTicking = false;

    const isInContainer = (x: number, y: number): boolean => {
      const rect = container.getBoundingClientRect();
      return (
        x >= rect.left && x <= rect.right &&
        y >= rect.top && y <= rect.bottom
      );
    };

    const setInitialMousePos = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      lastMouseX = mouseX;
      lastMouseY = mouseY;
      isCursorInContainer = isInContainer(mouseX, mouseY);
      document.removeEventListener('mousemove', setInitialMousePos);
    };
    document.addEventListener('mousemove', setInitialMousePos, { once: true });

    const hasMovedEnough = (): boolean => {
      const distance = Math.sqrt(
        Math.pow(mouseX - lastMouseX, 2) + Math.pow(mouseY - lastMouseY, 2)
      );
      return distance >= config.mouseThreshold;
    };

    const createImage = () => {
      const img = document.createElement('img');
      img.classList.add("trail-img");

      const randomIndex = Math.floor(Math.random() * images.length);
      const rotationImage = (Math.random() - 0.5) * 50;
      img.src = images[randomIndex];

      const rect = container.getBoundingClientRect();
      const relativeX = mouseX - rect.left;
      const relativeY = mouseY - rect.top;

      img.style.left = `${relativeX}px`;
      img.style.top = `${relativeY - 100}px`;
      img.style.transform = `translate(-50%, -50%) rotate(${rotationImage}deg) scale(0)`;
      img.style.transition = `transform ${config.inDuration}ms ${config.inEasing}`;

      container.appendChild(img);

      setTimeout(() => {
        img.style.transform = `translate(-50%, -50%) rotate(${rotationImage}deg) scale(1)`;
      }, 10);

      trail.push({
        element: img,
        rotation: rotationImage,
        removeTime: Date.now() + config.imageLifespan,  
      });
    };

    const createTrailImage = () => {
      if (!isCursorInContainer) return;
      
      const now = Date.now();

      if (isMoving && hasMovedEnough()) {
        lastMouseX = mouseX;
        lastMouseY = mouseY;
        lastSteadyImageTime = now;
        createImage();
        return;
      }

      if (!isMoving && (now - lastSteadyImageTime) >= config.idleCursorInterval) {
        lastSteadyImageTime = now;
        createImage();
      }
    };

    const createScrollTrailImage = () => {
      if (!isCursorInContainer) return;

      lastMouseX += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);
      lastMouseY += (config.mouseThreshold + 10) * (Math.random() > 0.5 ? 1 : -1);

      createImage();

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const removeOldImages = () => {
      const now = Date.now();
      if (now - lastRemovalTime < config.removalDelay || trail.length === 0) 
        return;

      const oldestImage = trail[0];
      if (now >= oldestImage.removeTime) {
        const imgToRemove = trail.shift();
        if (!imgToRemove) return;

        imgToRemove.element.style.transition = `transform ${config.outDuration}ms ${config.outEasing}`;
        imgToRemove.element.style.transform = `translate(-50%, -50%) rotate(${imgToRemove.rotation}deg) scale(0)`;

        lastRemovalTime = now;

        setTimeout(() => {
          if (imgToRemove.element.parentNode) {
            imgToRemove.element.parentNode.removeChild(imgToRemove.element);
          }
        }, config.outDuration);
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      isMoving = true;
      isCursorInContainer = isInContainer(mouseX, mouseY);

      if (isCursorInContainer) {
        isMoving = true;
        clearTimeout((window as any).moveTimeout);
        (window as any).moveTimeout = setTimeout(() => {
          isMoving = false;
        }, 100);
      }
    };

    const handleScroll = () => {
      isCursorInContainer = isInContainer(mouseX, mouseY);

      if (isCursorInContainer) {
        isMoving = true;
        lastMouseX += (Math.random() - 0.5) * 10;

        clearTimeout((window as any).moveTimeout);
        (window as any).scrollTimeout = setTimeout(() => {
          isMoving = false;
        }, 100);
      }
    };

    const handleScrollThrottled = () => {
      const now = Date.now();
      isScrolling = true;

      if (now - lastScrollTime < config.scrollThreshold) return;

      lastScrollTime = now;

      if (!scrollTicking) {
        requestAnimationFrame(() => {
          if (isScrolling) {
            createScrollTrailImage();
            isScrolling = false;
          }
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    };

    const animate = () => {
      createTrailImage();
      removeOldImages();
      animationFrameId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScrollThrottled, { passive: true });

    let animationFrameId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScrollThrottled);
      cancelAnimationFrame(animationFrameId);
      
      // Cleanup all trail images
      trail.forEach(item => {
        if (item.element.parentNode) {
          item.element.parentNode.removeChild(item.element);
        }
      });
    };
  }, []);

  // Handle link clicks with page transition

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const isDesktop = window.innerWidth >= 768;
    const isInternal = href.startsWith("/");
    const currentPath = window.location.pathname;

    // Check if clicking the same page - just refresh
    if (isInternal && currentPath === href) {
      setIsMenuActive(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }

    if (isDesktop && isInternal) {
      // For internal links on desktop: use page transition with full page load
      setIsPageTransition(true);
      sessionStorage.setItem("pageTransition", "true");

      setTimeout(() => {
        window.location.href = href;
      }, 800);
    } else if (isDesktop) {
      // For external links on desktop: use page transition
      setIsPageTransition(true);
      sessionStorage.setItem("pageTransition", "true");

      setTimeout(() => {
        if (href.startsWith("http")) {
          window.open(href, "_blank");
          sessionStorage.removeItem("pageTransition");
          setIsPageTransition(false);
          setIsMenuActive(false);
        } else if (href.startsWith("#")) {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          sessionStorage.removeItem("pageTransition");
          setIsPageTransition(false);
          setIsMenuActive(false);
        } else {
          window.location.href = href;
        }
      }, 800);
    } else {
      // Mobile behavior
      setIsMenuActive(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else if (href.startsWith("#")) {
        // Handle contact link specifically
        if (href === "#contact") {
          window.location.href = "mailto:mirkomimap@gmail.com";
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (isInternal) {
        // Use full page load for internal links on mobile
        setTimeout(() => {
          window.location.href = href;
        }, 100);
      } else {
        window.location.href = href;
      }
    }
  };

  /* =======================
==========================
GSAP SCROLL ANIMATIONS FOR KOMPARACIJA SECTION
==========================
========================== */

  useEffect(() => {
    // Wait a bit for DOM to be fully ready
    let animation: {
      scrollTrigger?: ScrollTrigger | null;
    } | null;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const initAnimation = () => {
      gsap.registerPlugin(ScrollTrigger);

      // ADJUST: Final X and Y positions for each image after animation completes
      // Generate random final positions on each refresh
      const komparacijaFinalPosition = [
        [Math.random() * 200 - 100, Math.random() * 200 - 200], // Image 1: random
        [Math.random() * 300 - 300, Math.random() * 100 - 50], // Image 2: random
        [Math.random() * 100 - 50, Math.random() * 100 - 50], // Image 3: random
        [Math.random() * 250 - 50, Math.random() * 150 - 75], // Image 4: random
      ];

      // ADJUST: Initial rotation for each image (in degrees)
      // Also randomize rotations
      const initialRotations = [
        Math.random() * 10 - 5, // Random between -5 and 5
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ];

      const komparacijaSlike = document.querySelectorAll(".komparacija-img");

      if (komparacijaSlike.length === 0) {
        console.warn("No images found for animation");
        return null;
      }

      // Randomize image sizes on each refresh
      komparacijaSlike.forEach((img) => {
        const randomWidth = Math.floor(Math.random() * (450 - 250 + 1)) + 250; // Random between 250-450px
        const randomHeight = Math.floor(Math.random() * (400 - 200 + 1)) + 200; // Random between 200-400px
        (img as HTMLElement).style.width = `${randomWidth}px`;
        (img as HTMLElement).style.height = `${randomHeight}px`;
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger: ".komparacija",
        start: "top top",
        end: `+=${window.innerHeight * 3.5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,

        onUpdate: (self) => {
          const progress = self.progress;
          // ADJUST: Stagger when each image starts animating (0-1 range)
          const phaseOneStartOffsets = [0.1, 0.18, 0.26, 0.34];

          komparacijaSlike.forEach((img, index) => {
            const initialRotation = initialRotations[index];
            const phase1Start = phaseOneStartOffsets[index];
            const phase1End = Math.min(
              phase1Start + (0.5 - phase1Start) * 0.9,
              0.5
            );

            let x = -50;
            let y, rotation, opacity;

            // PHASE 1: Images fly up from below and cover the header
            if (progress < phase1Start) {
              // Before animation starts: hidden below viewport
              y = 300;
              rotation = initialRotation;
              opacity = 0;
            } else if (progress <= 0.5) {
              // During phase 1: moving upward
              let phase1Progress;

              if (progress >= phase1End) {
                phase1Progress = 1;
              } else {
                const linearProgress =
                  (progress - phase1Start) / (phase1End - phase1Start);
                phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
              }
              // ADJUST: Change 250 (start Y) and 320 (movement amount) to control how far up they move
              y = 250 - phase1Progress * 330;
              rotation = initialRotation;
              // Fade in as they move
              opacity = Math.min(phase1Progress * 2, 1);
            } else {
              // End of phase 1: ADJUST -80 to control final upward position (more negative = higher up)
              y = -80;
              rotation = initialRotation;
              opacity = 1;
            }

            // PHASE 2: Images spread out horizontally and fall down below header
            // ADJUST: Stagger when each image starts spreading out
            const phaseTwoStartOffsets = [0.5, 0.52, 0.54, 0.56];
            const phase2Start = phaseTwoStartOffsets[index];
            const phase2End = Math.min(
              phase2Start + (0.95 - phase2Start) * 0.9,
              0.95
            );
            const finalX = komparacijaFinalPosition[index][0];
            const finalY = komparacijaFinalPosition[index][1];

            if (progress >= phase2Start && progress <= 0.95) {
              let phase2Progress;

              if (progress >= phase2End) {
                phase2Progress = 1;
              } else {
                const linearProgress =
                  (progress - phase2Start) / (phase2End - phase2Start);
                phase2Progress = 1 - Math.pow(1 - linearProgress, 3);
              }

              x = -50 + (finalX + 50) * phase2Progress;
              y = -80 + (finalY + 80) * phase2Progress;
              rotation = initialRotation * (1 - phase2Progress);
            } else if (progress > 0.95) {
              x = finalX;
              y = finalY;
              rotation = 0;
            }

            gsap.set(img, {
              transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
              opacity: opacity,
            });
          });
        },
      });

      return { scrollTrigger };
    };

    timeout = setTimeout(() => {
      animation = initAnimation();
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animation) {
        if (animation.scrollTrigger) animation.scrollTrigger.kill();
      }
    };
  }, []);

  /* =======================
==========================
SELECTED WORKS PARALLAX
==========================
========================== */

  useEffect(() => {
    const initDelay = 300;

    const timeoutId = setTimeout(() => {
      const selectedWorksSection = document.querySelector(".selected-works-section");
      const bigImageFigures = document.querySelectorAll(".selected-works-big-image");

      if (!selectedWorksSection || bigImageFigures.length === 0) return;

      // Create parallax effect for big images (move up very slightly)
      bigImageFigures.forEach((figure) => {
        gsap.fromTo(figure, 
          {
            y: 0,
          },
          {
            y: -100,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: selectedWorksSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === selectedWorksSection) {
            trigger.kill();
          }
        });
      };
    }, initDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  /* =======================
==========================
PARALLAX GALLERY SECTION
==========================
========================== */

  useEffect(() => {
    const initDelay = 300;

    const timeoutId = setTimeout(() => {
      const parallaxSection = document.querySelector(".parallax-gallery");
      const textElement = document.querySelector(".parallax-gallery-text h3");
      const imageElement = document.querySelector(
        ".parallax-gallery-image img"
      );

      if (!parallaxSection || !textElement || !imageElement)
        return;

      const OVERLAY_COLOR = "rgba(255, 255, 255, 0.8)";

      // Create parallax effect for image (moves up slower)
      gsap.to(imageElement, {
        y: -150, // Moves up as you scroll down
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: parallaxSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Animate text color with sharp color change based on image overlap
      // Use throttling to reduce expensive layout calculations
      let lastUpdateTime = 0;
      const throttleMs = 32; // ~30fps for better performance
      let rafId: number | null = null;
      let cachedTextRect: DOMRect | null = null;
      let cachedImageRect: DOMRect | null = null;

      // Cache rects in RAF for smoother updates
      const updateRects = () => {
        cachedTextRect = textElement.getBoundingClientRect();
        cachedImageRect = imageElement.getBoundingClientRect();
      };

      ScrollTrigger.create({
        trigger: parallaxSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5,
        onUpdate: () => {
          const now = performance.now();
          if (now - lastUpdateTime < throttleMs) return;
          lastUpdateTime = now;

          // Use RAF to batch rect calculations
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            updateRects();
            
            if (!cachedTextRect || !cachedImageRect) return;
            
            const textRect = cachedTextRect;
            const imageRect = cachedImageRect;

          // Check if there's any overlap
          const isOverlapping = !(
            textRect.right < imageRect.left ||
            textRect.left > imageRect.right ||
            textRect.bottom < imageRect.top ||
            textRect.top > imageRect.bottom
          );

          if (isOverlapping) {
            // Calculate the overlap boundaries
            const overlapTop = Math.max(textRect.top, imageRect.top);
            const overlapBottom = Math.min(textRect.bottom, imageRect.bottom);
            const overlapLeft = Math.max(textRect.left, imageRect.left);
            const overlapRight = Math.min(textRect.right, imageRect.right);

            // Calculate percentages for vertical gradient
            const topPercent =
              ((overlapTop - textRect.top) / textRect.height) * 100;
            const bottomPercent =
              ((overlapBottom - textRect.top) / textRect.height) * 100;

            // Calculate percentages for horizontal gradient
            const leftPercent =
              ((overlapLeft - textRect.left) / textRect.width) * 100;
            const rightPercent =
              ((overlapRight - textRect.left) / textRect.width) * 100;

            // Build gradient that colors only the overlapping area with sharp transitions
            const gradient = `linear-gradient(to bottom, var(--black) 0%, var(--black) ${topPercent}%, ${OVERLAY_COLOR} ${topPercent}%, ${OVERLAY_COLOR} ${bottomPercent}%, var(--black) ${bottomPercent}%, var(--black) 100%), linear-gradient(to right, var(--black) 0%, var(--black) ${leftPercent}%, ${OVERLAY_COLOR} ${leftPercent}%, ${OVERLAY_COLOR} ${rightPercent}%, var(--black) ${rightPercent}%, var(--black) 100%)`;

            // Use gsap.set() for instant updates - no tween creation
            gsap.set(textElement, {
              backgroundImage: gradient,
              backgroundClip: "text",
              webkitBackgroundClip: "text",
              webkitTextFillColor: "transparent",
              backgroundBlendMode: "multiply",
            });
          } else {
            // Reset to normal black text - use gsap.set() for instant updates
            gsap.set(textElement, {
              backgroundImage: "none",
              backgroundClip: "unset",
              webkitBackgroundClip: "unset",
              webkitTextFillColor: "unset",
              color: "var(--black)",
            });
          }
          });
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === parallaxSection) {
            trigger.kill();
          }
        });
      };
    }, initDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      <div className="grain-overlay"></div>
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-header-content">
          <button
            className="nav-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuActive ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      {/* Spotlight Menu Overlay */}
      <nav
        className={`nav-spotlight-menu ${isMenuActive ? "active" : ""} ${
          isPageTransition ? "page-transition" : ""
        } ${isReturning ? "returning" : ""}`}
      >
        <div className="nav-spotlight-background"></div>
        <div className="nav-spotlight-links">
          <a href="/" onClick={(e) => handleLinkClick(e, "/")}>
            <span>home</span>
          </a>
          <a href="/about" onClick={(e) => handleLinkClick(e, "/about")}>
            <span>about</span>
          </a>
          <a href="/work" onClick={(e) => handleLinkClick(e, "/work")}>
            <span>work</span>
          </a>
          <a href="mailto:mirkomimap@gmail.com">
            <span>contact</span>
          </a>
        </div>
      </nav>

      {/* Hero Grid Section */}

      <section className="hero-grid-section" ref={heroContainerRef}>
        <div className="hero-grid-container">
          <div className="hero-grid">
            <div className="hero-grid-header">
              <h1 className="title" style={{ position: "relative" }}>
                mirko.
                <img
                  src="/nier.gif"
                  alt=""
                  className="earth-gif"
                  style={{
                    display: "block",
                    width: "6.5rem",
                    height: "6.5rem",
                    position: "absolute",
                    left: "11.5rem",
                    top: "0.5rem",
                  }}
                />
              </h1>
            </div>
            <div className="hero-grid-text">
              <p>
                Hello, I'm a{" "}
                <span className="highlight-underline">front-end</span> developer.{" "}
              </p>
            </div>
            <div className="hero-grid-cta">
              <a
                className="link"
                style={{ fontSize: "1.2rem" }}
                onClick={() =>
                  (window.location.href = "mailto:mirkomimap@gmail.com")
                }
              >
                SAY HELLO{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    marginLeft: "1px",
                    marginBottom: "4px",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                  className="ai ai-ArrowUpRight"
                >
                  <path d="M18 6L6 18" />
                  <path d="M8 6h10v10" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Scroll Animation Section */}
      <section className="komparacija">
        <div className="komparacija-header">
          <h2>
            Scroll down{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ai ai-ArrowDown"
            >
              <path d="M12 20V4" />
              <path d="M5 13l7 7 7-7" />
            </svg>
          </h2>
         
        </div>
        <div className="komparacija-slike">
          <div className="komparacija-img">
            <img src="/circle6.jpg" alt="Picture 1" />
          </div>
          <div className="komparacija-img">
            <img src="/img6.jpg" alt="Picture 2" />
          </div>
          <div className="komparacija-img">
            <img src="/circle2.jpg" alt="Picture 3" />
          </div>
          <div className="komparacija-img">
            <img src="/circle1.jpg" alt="Picture 4" />
          </div>
        </div>
      </section>

      {/* Grid background in white with parallax effect. */}
      <section className="parallax-gallery">
        <div
          style={{
            zIndex: 11,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          className="parallax-gallery-inner"
          style={{ position: "relative", zIndex: 11 }}
        >
          <div className="parallax-gallery-text">
            <h3>
              I'm a developer based in{" "}
              <span className="highlight-scribble">Serbia</span>, aiming to
              create web experiences that effectively represent your brand on the internet.

            </h3>
          </div>
          <div className="parallax-gallery-image">
            <img src="/circle5.jpg" alt="Gallery placeholder" />
          </div>
        </div>
      </section>

        {/* Selected Works Section */}
      <section className="selected-works-section">
        <div className="selected-works-header">
          <h3 className="selected-works-title">Some stuff I made.</h3>
          <a href="/work" className="link">
            ALL OF MY WORK{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                marginLeft: "1px",
                marginBottom: "4px",
                display: "inline-block",
                verticalAlign: "middle",
              }}
            >
              <path d="M18 6L6 18" />
              <path d="M8 6h10v10" />
            </svg>
          </a>
        </div>
        <div className="selected-works-container">
          <div className="selected-works-left">
            <figure className="variant-1">
              <a
                href="https://example.com/screening"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle3.jpg" alt="Screening project" />
              </a>
              <div className="figure-description">
                john yakuza estates // REAL ESTATE // JAN 2026
              </div>
              <figcaption>placeholder 01.</figcaption>
            </figure>
            <figure className="variant-2">
              <a
                href="https://example.com/residency"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle2.jpg" alt="Residency project" />
              </a>
              <div className="figure-description">
                ANOTHER PROJECT DESCRIPTION HERE // FILM // FEB 2026
              </div>
              <figcaption>placeholder 02.</figcaption>
            </figure>
            <figure className="variant-3">
              <a
                href="https://example.com/nier"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle5.jpg" alt="Project" />
              </a>
              <div className="figure-description">
                COOL MAN // MOTORCYCLE // MAR 2027
              </div>
              <figcaption>placeholder 04.</figcaption>
            </figure>
            <figure className="variant-4">
              <a
                href="https://example.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle1.jpg" alt="Featured project" />
              </a>
              <div className="figure-description">
                TRAIN SPOTTED // TRANSPORT // APR 2028
              </div>
              <figcaption>placeholder 05.</figcaption>
            </figure>
          </div>
          <div className="selected-works-right">
            <figure className="selected-works-big-image variant-1">
              <a
                href="https://example.com/jony-ive"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle4.jpg" alt="Featured project" />
              </a>
              <div className="figure-description">
                GREATEST WEBSITE IN THE HISTORY OF WEBSITES // EMIL // FEB 2017
              </div>
              <figcaption>placeholder 03.</figcaption>
            </figure>
            <figure className="selected-works-big-image variant-2">
              <a
                href="https://example.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle1.jpg" alt="Featured project" />
              </a>
              <div className="figure-description">
                TRAIN SPOTTED // TRANSPORT // APR 2028
              </div>
              <figcaption>placeholder 05.</figcaption>
            </figure>
            <figure className="selected-works-big-image variant-3">
              <a
                href="https://example.com/featured-project"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle6.jpg" alt="Featured project" />
              </a>
              <div className="figure-description">
                "he is walking" / fitness / jun 2026
              </div>
              <figcaption>placeholder 06.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="footer-section">
        <div className="footer-links">
          <div className="footer-column">
            <a href="/" className="link">home</a>
            <a href="/work" className="link">work</a>
            <a href="/about" className="link">about</a>
    
          </div>
          
          <div className="footer-column">
            <a href="mailto:mirkomimap@gmail.com" className="link">mail
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    marginLeft: "2px",
                    marginBottom: "3.5px",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                  className="ai ai-ArrowUpRight"
                >
                  <path d="M18 6L6 18" />
                  <path d="M8 6h10v10" />
                </svg>
            </a>
            <a href="https://x.com/mirkosayshello" className="link">x</a>
            <a href="https://github.com/m3Mza/portfolio" className="link">github</a>

          </div>
        </div>
        
  
        
        <div className="footer-bottom">
          <p>© made with <span className="highlight-circle">love</span>, mirko, 2026.</p>
          <h1 className="footer-logo">mirko</h1>
          <img
                  src="/nier.gif"
                  alt=""
                  className="earth-gif"
                  style={{
                    display: "block",
                    width: "14rem",
                    height: "14rem",
                    position: "absolute",
                    left: "27.5rem",
                    bottom: "14rem",
                  }}
                />
        </div>
      </footer>
    </>
  );
}

export default App;
