
import { useState, useEffect, useRef } from "react";

import { useNavigate } from "react-router-dom";
import "./App.css";
import "./responsive.css";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {

  // Initialize Lenis smooth scroll
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

  
  // Meni i nneke druge gluposti nemam pojma iskreno

  const [isMenuActive, setIsMenuActive] = useState(false); // Always start with menu closed
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  // Check if we're coming from a page transition
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
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else if (isInternal) {
        navigate(href);
      } else {
        window.location.href = href;
      }
    }
  };

  // GSAP scroll animation for komparacija section

  useEffect(() => {
    // Wait a bit for DOM to be fully ready
    let animation: {
      scrollTrigger?: ScrollTrigger | null;
    } | null;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const initAnimation = () => {
      gsap.registerPlugin(ScrollTrigger);

      // ADJUST: Final X and Y positions for each image after animation completes
      // [x, y] where x controls horizontal spacing, y controls vertical position
      // More negative Y = higher up, more positive Y = lower down
      const komparacijaFinalPosition = [
        [-180, -55], // Image 1: far left
        [-250, 25], // Image 2: mid left
        [10, 0], // Image 3: mid right
        [165, -100], // Image 4: far right
      ];

      // ADJUST: Initial rotation for each image (in degrees)
      const initialRotations = [5, -1, 4, -2];

      const komparacijaSlike = document.querySelectorAll(".komparacija-img");

      if (komparacijaSlike.length === 0) {
        console.warn("No images found for animation");
        return null;
      }

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


  // Folder hover animation (no click handler for navigation)
  useEffect(() => {
    const folders = document.querySelectorAll(".folders .folder");
    const folderWrappers = document.querySelectorAll(
      ".folders .folder-wrapper"
    );
    if (folders.length === 0) return;
    let isMobile = window.innerWidth < 1000;
    function setInitialPositions() {
      gsap.set(folderWrappers, { y: isMobile ? 0 : 25 });
    }
    setInitialPositions();
    const mouseEnterHandlers: Array<{
      folder: Element;
      mouseEnterHandler: EventListener;
    }> = [];
    const mouseLeaveHandlers: Array<{
      folder: Element;
      mouseLeaveHandler: EventListener;
    }> = [];
    const clickHandlers: Array<{
      folder: Element;
      clickHandler: EventListener;
    }> = [];
    folders.forEach((folder, index) => {
      const previewImages = folder.querySelectorAll(".folder-preview-img");
      
      // Click handler for navigation
      const clickHandler = () => {
        const target = folder as HTMLElement;
        const link = target.getAttribute("data-link");
        const mailto = target.getAttribute("data-mailto");
        
        if (mailto) {
          window.location.href = `mailto:${mailto}`;
        } else if (link) {
          if (link.startsWith("http")) {
            window.open(link, "_blank");
          } else {
            window.location.href = link;
          }
        }
      };
      folder.addEventListener("click", clickHandler);
      clickHandlers.push({ folder, clickHandler });
      
      const mouseEnterHandler = () => {
        if (isMobile) return;
        folders.forEach((siblingFolder) => {
          if (siblingFolder !== folder) {
            siblingFolder.classList.add("disabled");
          }
        });
        gsap.to(folderWrappers[index], {
          y: 0,
          duration: 0.25,
          ease: "back.out(1.7)",
        });
        previewImages.forEach((img, imgIndex) => {
          let rotation;
          if (imgIndex === 0) {
            rotation = gsap.utils.random(-20, -10);
          } else if (imgIndex === 1) {
            rotation = gsap.utils.random(-10, 10);
          } else {
            rotation = gsap.utils.random(10, 20);
          }
          gsap.to(img, {
            y: "-100%",
            rotation: rotation,
            duration: 0.25,
            ease: "back.out(1.7)",
            delay: imgIndex * 0.025,
          });
        });
      };
      folder.addEventListener("mouseenter", mouseEnterHandler);
      mouseEnterHandlers.push({ folder, mouseEnterHandler });
      const mouseLeaveHandler = () => {
        if (isMobile) return;
        folders.forEach((siblingFolder) => {
          siblingFolder.classList.remove("disabled");
        });
        gsap.to(folderWrappers[index], {
          y: 25,
          duration: 0.25,
          ease: "back.out(1.7)",
        });
        previewImages.forEach((img, imgIndex) => {
          gsap.to(img, {
            y: "0%",
            rotation: 0,
            duration: 0.25,
            ease: "back.out(1.7)",
            delay: imgIndex * 0.05,
          });
        });
      };
      folder.addEventListener("mouseleave", mouseLeaveHandler);
      mouseLeaveHandlers.push({ folder, mouseLeaveHandler });
    });
    const handleResize = () => {
      const currentBreakpoint = window.innerWidth < 1000;
      if (currentBreakpoint !== isMobile) {
        isMobile = currentBreakpoint;
        setInitialPositions();
      }
      folders.forEach((folder) => {
        folder.classList.remove("disabled");
      });
      const allPreviewImages = document.querySelectorAll(".folder-preview-img");
      gsap.set(allPreviewImages, { y: "0%", rotation: 0 });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      mouseEnterHandlers.forEach(({ folder, mouseEnterHandler }) => {
        folder.removeEventListener("mouseenter", mouseEnterHandler);
      });
      mouseLeaveHandlers.forEach(({ folder, mouseLeaveHandler }) => {
        folder.removeEventListener("mouseleave", mouseLeaveHandler);
      });
      clickHandlers.forEach(({ folder, clickHandler }) => {
        folder.removeEventListener("click", clickHandler);
      });
    };
  }, [navigate]);

  // ========================================
  // HORIZONTAL SCROLL ANIMATION
  // ========================================

  useEffect(() => {
    const container = horizontalScrollRef.current;
    if (!container) return;

    const panels = container.querySelector(".horizontal-panels");
    if (!panels) return;

    // ADJUST: Increase this value if animation is twitchy (try 500, 1000, or 1500)
    const initDelay = 200;

    const timeoutId = setTimeout(() => {
      const scrollTrigger = ScrollTrigger.create({
        trigger: container,

        start: "top top",

        // ====================================
        // END: When the animation completes
        // ====================================
        // * 1.0 = FAST (minimal scrolling needed)
        // * 1.5 = MEDIUM (current setting - good balance)
        // * 2.0 = SLOW (more scrolling needed to complete animation)
        // * 2.5 = VERY SLOW (lots of scrolling)
        end: () => `+=${window.innerWidth * 1.5}`,

        // ====================================
        // PIN: Lock the section in place
        // ====================================
        pin: true,
        pinSpacing: true,

        // scrub
        // true = Instant response (can feel jerky)
        // 0.1 = Very snappy, minimal smoothing
        // 0.5 = Balanced (current - smooth but responsive)
        // 1 = Slower, more lag/smoothing
        // 2 = Very smooth but feels sluggish
        scrub: 0.5,

        onUpdate: (self) => {
          const progress = self.progress;
          const moveDistance = window.innerWidth * 1;

          // Use gsap.set() for immediate updates - no tween creation
          gsap.set(panels, {
            x: -progress * moveDistance,
          });
        },
      });

      return () => {
        if (scrollTrigger) {
          scrollTrigger.kill();
        }
      };
    }, initDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  
  
  // ========================================
  // PARALLAX GALLERY TEXT OVER IMAGE ANIMATION
  // ========================================
  useEffect(() => {
    const initDelay = 300;

    const timeoutId = setTimeout(() => {
      const parallaxSection = document.querySelector(".parallax-gallery");
      const textElement = document.querySelector(".parallax-gallery-text h3");
      const imageElement = document.querySelector(
        ".parallax-gallery-image img"
      );
      const captionElement = document.querySelector(
        ".parallax-gallery-caption"
      );

      if (!parallaxSection || !textElement || !imageElement || !captionElement)
        return;

      const OVERLAY_COLOR = "var(--salmon)";

      // Create parallax effect for image (moves up slower)
      gsap.to(imageElement, {
        y: -150, // Moves up as you scroll down
        ease: "none",
        scrollTrigger: {
          trigger: parallaxSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Create parallax effect for caption (moves down slower)
      gsap.to(captionElement, {
        y: 150, // Moves down slower than scroll
        ease: "none",
        scrollTrigger: {
          trigger: parallaxSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Animate text color with sharp color change based on image overlap
      ScrollTrigger.create({
        trigger: parallaxSection,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.5, // Smooth scrubbing
        onUpdate: () => {
          // Cache rect calculations for performance
          const textRect = textElement.getBoundingClientRect();
          const imageRect = imageElement.getBoundingClientRect();

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
            const gradient = `
              linear-gradient(to bottom,
                var(--black) 0%,
                var(--black) ${topPercent}%,
                ${OVERLAY_COLOR} ${topPercent}%,
                ${OVERLAY_COLOR} ${bottomPercent}%,
                var(--black) ${bottomPercent}%,
                var(--black) 100%
              ),
              linear-gradient(to right,
                var(--black) 0%,
                var(--black) ${leftPercent}%,
                ${OVERLAY_COLOR} ${leftPercent}%,
                ${OVERLAY_COLOR} ${rightPercent}%,
                var(--black) ${rightPercent}%,
                var(--black) 100%
              )
            `;

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
      <style>{`
        .folder-work-white .folder-index::after {
          background-color: var(--white) !important;
        }
      `}</style>
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
            <span >home</span>
          </a>
          <a href="/about" onClick={(e) => handleLinkClick(e, "/about")}>
            <span >about</span>
          </a>
          <a href="/work" onClick={(e) => handleLinkClick(e, "/work")}>
            <span >work</span>
          </a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")}>
            <span >contact</span>
          </a>
        </div>
      </nav>

      {/* Hero Grid Section */}

      <section className="hero-grid-section">
        <div className="hero-grid-container">
          <div className="hero-grid">
            <div className="hero-grid-header">
              <h1 style={{ position: "relative" }}>
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
                Hi. I'm a <span className="salmon-background"> code-based </span>web developer who makes websites <span className="salmon-background">f#*&#@g</span> cool.
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
                  SAY HELLO.   <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '1px', marginBottom: '4px', display: 'inline-block', verticalAlign: 'middle' }} className="ai ai-ArrowUpRight">
            <path d="M18 6L6 18"/>
            <path d="M8 6h10v10"/>
          </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Scroll Animation Section */}
      <section className="komparacija">
        <div className="komparacija-header">
          <h1>
            Scroll down <svg xmlns="http://www.w3.org/2000/svg" width="55" height="55" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ai ai-ArrowDown"><path d="M12 20V4"/><path d="M5 13l7 7 7-7"/></svg> to{" "}
            <span className="salmon-background">learn more.</span>
          </h1>
        </div>
        <div className="komparacija-slike">
          <div className="komparacija-img">
            <img src="/circle5.jpg" alt="Picture 1" />
          </div>
          <div className="komparacija-img">
            <img src="/nier.gif" alt="Picture 2" />
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
              I am a web developer based in Serbia. I try to create timeless web experiences
              that are memorable and keep users coming back for more.
            </h3>
          </div>
          <div className="parallax-gallery-image">
            <img src="/circle5.jpg" alt="Gallery placeholder" />
          </div>
          <p className="parallax-gallery-caption">
            For me, every project is a story of its' own, whether that be a hastily dished out <span className="salmon-background">framework</span> or a fine-tuned application made from <span className="salmon-background">scratch</span>.
          </p>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="faq-section">
        <div className="faq-container">
          <h1 className="faq-title">So, what do I <span className="salmon-background">actually</span> do?</h1>
          
          <div className="faq-items">
            <div className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleAccordion(1)}
              >
                <span className="faq-number">01</span>
                <h3><span className="salmon-background">Strategic research.</span></h3>
                <span className={`faq-icon ${activeAccordion === 1 ? 'active' : ''}`}>{activeAccordion === 1 ? '−' : '+'}</span>
              </div>
              <div className={`faq-answer ${activeAccordion === 1 ? 'active' : ''}`}>
                <p>I study the context of your brand, its' story and competitors, to develop a broad idea on the next step.</p>
              </div>
            </div>

            <div className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleAccordion(2)}
              >
                <span className="faq-number">02</span>
                <h3><span className="salmon-background">Brand identity.</span></h3>
                <span className={`faq-icon ${activeAccordion === 2 ? 'active' : ''}`}>{activeAccordion === 2 ? '−' : '+'}</span>
              </div>
              <div className={`faq-answer ${activeAccordion === 2 ? 'active' : ''}`}>
                <p>I'll carefully pick out the proper typography, palette and imaging for your brand, to ensure that its' message gets delivered.</p>
              </div>
            </div>

            <div className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleAccordion(3)}
              >
                <span className="faq-number">03</span>
                <h3><span className="salmon-background">Web development.</span></h3>
                <span className={`faq-icon ${activeAccordion === 3 ? 'active' : ''}`}>{activeAccordion === 3 ? '−' : '+'}</span>
              </div>
              <div className={`faq-answer ${activeAccordion === 3 ? 'active' : ''}`}>
                <p>I develop an engaging and efficient web presence tailored to your needs, with the tools best suited for the job.</p>
              </div>
            </div>

            <div className="faq-item">
              <div 
                className="faq-question" 
                onClick={() => toggleAccordion(4)}
              >
                <span className="faq-number">04</span>
                <h3><span className="salmon-background">Long-term maintenance</span></h3>
                <span className={`faq-icon ${activeAccordion === 4 ? 'active' : ''}`}>{activeAccordion === 4 ? '−' : '+'}</span>
              </div>
              <div className={`faq-answer ${activeAccordion === 4 ? 'active' : ''}`}>
                <p>If needed I will perform routine maintenance on the website, fine-tuning the performance aswell as later implementing new changes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Container */}
      <div
        ref={horizontalScrollRef}
        className="horizontal-scroll-container"
        style={{ zIndex: 10 }}
      >
        <div className="horizontal-panels">
          {/* Panel 1 - Header */}
          <section className="horizontal-panel panel-purple">
            <div className="big-black-circle">
              <h1 className="side-scroll-header">
                Selected
                <br />
                work.
              </h1>
            </div>
          </section>

          {/* Panel 2 - Two Stacked Images */}
          <section className="horizontal-panel panel-black panel-stacked">
            <figure>
              <a
                href="https://example.com/screening"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle3.jpg" alt="Screening project" />
              </a>
              <div className="figure-description">JOHN YAKUZA ESTATE // REAL ESTATE // JAN 2026</div>
              <figcaption>placeholder 01.</figcaption>
            </figure>
            <figure>
              <a
                href="https://example.com/residency"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle2.jpg" alt="Residency project" />
              </a>
              <div className="figure-description">ANOTHER PROJECT DESCRIPTION HERE // FILM // FEB 2026</div>
              <figcaption>placeholder 02.</figcaption>
            </figure>
          </section>

          {/* Panel 3 - One Big Image */}
          <section className="horizontal-panel panel-black panel-big-image">
            <figure className="panel-big-image figure1">
              <a
                href="https://example.com/jony-ive"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle4.jpg" alt="Featured project" />
              </a>
              <div className="figure-description">GREATEST WEBSITE IN THE HISTORY OF WEBSITES // EMIL // FEB 2017</div>
              <figcaption>placeholder 03.</figcaption>
            </figure>
          </section>

          {/* Panel 4 - Two Stacked Images */}
          <section className="horizontal-panel panel-black panel-stacked">
            <figure>
              <a
                href="https://example.com/nier"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle5.jpg" alt="Project" />
              </a>
              <div className="figure-description">COOL MAN // MOTORCYCLE // MAR 2027</div>
              <figcaption>placeholder 04.</figcaption>
            </figure>

            <a href="/work" className="link-alt">
              ALL OF MY WORKS   <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '1px', marginBottom: '4px', display: 'inline-block', verticalAlign: 'middle' }} className="ai ai-ArrowUpRight">
            <path d="M18 6L6 18"/>
            <path d="M8 6h10v10"/>
          </svg>
            </a>
          </section>
        </div>
      </div>

      {/* Continuation of the horizontal scroll - vertical */}
      <section className="vertical-continuation">
        <section className="horizontal-panel panel-black panel-big-image">
          <figure className="vertical-continuation-figure-small panel-big-image figure2">
            <a
              href="https://example.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/circle1.jpg" alt="Featured project" />
            </a>
            <div className="figure-description">TRAIN SPOTTED // TRANSPORT // APR 2028</div>
            <figcaption>placeholder 05.</figcaption>
          </figure>
        </section>
        <section className="horizontal-panel panel-black panel-big-image">
          <figure className="vertical-continuation-figure-small panel-big-image figure3">
            <a
              href="https://example.com/featured-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/circle6.jpg" alt="Featured project" />
            </a>
            <div className="figure-description">HE IS WALKING // FITNESS // JUN 1984</div>
            <figcaption>placeholder 06.</figcaption>
          </figure>
        </section>
      </section>

      {/* Footer with Folders */}
      <div
        className="folders"
        style={{
         backgroundColor: "var(--black)",
        }}
      >
        <h1
          style={{
            marginLeft: "3rem",
            marginTop: "2rem",
            fontWeight: 700,
            fontFamily: "Playfair Display, serif",
            color: "var(--white)",
          }}
        >
        links.
        </h1>
        <div className="row">
          <div className="folder variant-1 folder-work-white" data-link="/work">
            <div className="folder-preview">
              <div className="folder-preview-img">
                <img src="/circle1.jpg" alt="Placeholder 1" />
              </div>
              <div className="folder-preview-img">
                <img src="/circle2.jpg" alt="Placeholder 2" />
              </div>
              <div className="folder-preview-img">
                <img src="/circle3.jpg" alt="Placeholder 3" />
              </div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index" style={{ backgroundColor: "var(--white)" }}>
                <p style={{ color: "var(--black)" }}>01</p>
              </div>
              <div className="folder-name" style={{ backgroundColor: "var(--white)" }}>
                <h1 style={{ color: "var(--black)" }}>work</h1>
              </div>
            </div>
          </div>
          <div
            className="folder variant-2"
            data-link="https://github.com/m3Mza/portfolio"
          >
            <div className="folder-preview">
              <div className="folder-preview-img"></div>
              <div className="folder-preview-img">
                <img src="/nier.gif" alt="GitHub" />
              </div>
              <div className="folder-preview-img"></div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index">
                <p>02</p>
              </div>
              <div className="folder-name">
                <h1>repo</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="folder variant-2" data-link="/about">
            <div className="folder-preview">
              <div className="folder-preview-img"></div>
              <div className="folder-preview-img"></div>
              <div className="folder-preview-img">
                <img src="/mirko3.jpeg" alt="Resume 3" />
              </div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index">
                <p>03</p>
              </div>
              <div className="folder-name">
                <h1>about</h1>
              </div>
            </div>
          </div>
          <div className="folder variant-3" data-mailto="mirkomimap@gmail.com">
            <div className="folder-preview">
              <div className="folder-preview-img"></div>
              <div className="folder-preview-img"></div>
              <div className="folder-preview-img"></div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index">
                <p>04</p>
              </div>
              <div className="folder-name">
                <h1>contact
                  
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
