import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  // State for mouth animation progress (0 = closed, 1 = fully open)
  const [mouthProgress, setMouthProgress] = useState(0);
  // State to track if the mouth is in 'locked' mode (after scroll threshold)
  const [mouthLocked, setMouthLocked] = useState(false);
  // State for mouse-based mouth progress (used after lock)
  const [mouseMouthProgress, setMouseMouthProgress] = useState(1);
  const mouthSectionRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
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

  // Mouth animation scroll effect with lock and mouse interaction
  useEffect(() => {
    const handleScroll = () => {
      const section = mouthSectionRef.current;
      if (!section) return;

        // Adjustable thresholds for mouth lock and close
  // lockThreshold: when to lock the mouth (0 = top, 1 = bottom)
  // closeThreshold: when to start closing (lower = closes earlier)
  const lockThreshold = 0.15;
  const closeThreshold = 1;

  // Adjustable value for mouth closing scroll threshold
  // 0 = closes as soon as section leaves viewport
  // 0.5 = closes when 50% of section is still visible
  // 1 = closes when section is fully visible (never closes)
  // Example: 0.2 means closes when only 20% of the section is visible
  const mouthCloseScrollThreshold = 0.2; // Set between 0 and 1

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const sectionHeight = rect.height;
        const visibleTop = Math.max(0, windowHeight - rect.top);
        const rawProgress = (visibleTop / sectionHeight - 0.8) / 0.3; // Start later (e.g., 0.7) and finish faster (e.g., /0.2)
        // Clamp progress between 0 and 1
        const progress = Math.min(1, Math.max(0, rawProgress));

        if (progress >= lockThreshold && rawProgress < closeThreshold) {
          setMouthProgress(lockThreshold);
          setMouthLocked(true);
        } else if (rawProgress >= closeThreshold) {
          setMouthProgress(lockThreshold);
          setMouthLocked(false);
        } else {
          setMouthProgress(progress);
          setMouthLocked(false);
        }
      } else if (rect.top > windowHeight) {
        setMouthProgress(0);
        setMouthLocked(false);
      } else {
        // Calculate how much of the section is visible (0 = not visible, 1 = fully visible)
        const section = mouthSectionRef.current;
        if (section) {
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
          const sectionHeight = rect.height;
          // Amount of section visible in viewport
          const visible = Math.max(0, Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0));
          const visibleRatio = visible / sectionHeight;
          if (visibleRatio < mouthCloseScrollThreshold) {
            setMouthProgress(0);
            setMouthLocked(false);
          } else {
            setMouthProgress(0);
            setMouthLocked(false);
          }
        } else {
          setMouthProgress(0);
          setMouthLocked(false);
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Mouse move effect for mouth overlays after lock
  useEffect(() => {
    if (!mouthLocked) return;
    const section = mouthSectionRef.current;
    if (!section) return;

    // Mouse move handler: map Y position to mouth opening (0 = closed, 1 = open)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const progress = Math.min(1, Math.max(0, y / rect.height));
      setMouseMouthProgress(progress);
    };

    // Mouse leave handler: reset to fully open when mouse leaves
    const handleMouseLeave = () => {
      setMouseMouthProgress(1);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouthLocked]);



// Handle link clicks with page transition

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault();
  const isDesktop = window.innerWidth >= 768;
  const isInternal = href.startsWith('/');
  
  if (isDesktop) {
    setIsPageTransition(true);
    sessionStorage.setItem('pageTransition', 'true');
    
    setTimeout(() => {
      if (href.startsWith('http')) {
        window.open(href, '_blank');
        sessionStorage.removeItem('pageTransition');
        setIsPageTransition(false);
        setIsMenuActive(false);
      } else if (href.startsWith('#')) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        sessionStorage.removeItem('pageTransition');
        setIsPageTransition(false);
        setIsMenuActive(false);
      } else if (isInternal) {
        // Don't close menu here - let the new page handle it
        navigate(href);
      } else {
        window.location.href = href;
      }
    }, 800);
  } else {
    // Mobile behavior
    setIsMenuActive(false);
    if (href.startsWith('http')) {
      window.open(href, '_blank');
    } else if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    } else if (isInternal) {
      navigate(href);
    } else {
      window.location.href = href;
    }
  }
};

  // GSAP ScrollTrigger animation for images
  useEffect(() => {
    // Wait a bit for DOM to be fully ready
    let animation: {
      scrollTrigger?: ScrollTrigger | null;
      lenisKomparacija?: Lenis | null;
    } | null;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const initAnimation = () => {
      gsap.registerPlugin(ScrollTrigger);

      const lenisKomparacija = new Lenis();
      lenisKomparacija.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisKomparacija.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      // ADJUST: Final X and Y positions for each image after animation completes
      // [x, y] where x controls horizontal spacing, y controls vertical position
      // More negative Y = higher up, more positive Y = lower down
      const komparacijaFinalPosition = [
        [-240, -15], // Image 1: far left
        [-120, -5], // Image 2: mid left
        [20, -5], // Image 3: mid right
        [140, -15], // Image 4: far right
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

      return { scrollTrigger, lenisKomparacija };
    };

    timeout = setTimeout(() => {
      animation = initAnimation();
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animation) {
        if (animation.scrollTrigger) animation.scrollTrigger.kill();
        if (animation.lenisKomparacija) animation.lenisKomparacija.destroy();
        gsap.ticker.remove((time) => {
          if (animation && animation.lenisKomparacija) animation.lenisKomparacija.raf(time * 1000);
        });
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
    const mouseEnterHandlers: Array<{ folder: Element; mouseEnterHandler: EventListener }> = [];
    const mouseLeaveHandlers: Array<{ folder: Element; mouseLeaveHandler: EventListener }> = [];
    folders.forEach((folder, index) => {
      const previewImages = folder.querySelectorAll(".folder-preview-img");
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
    };
  }, []);

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
      const parallaxSection = document.querySelector('.parallax-gallery');
      const textElement = document.querySelector('.parallax-gallery-text h3');
      const imageElement = document.querySelector('.parallax-gallery-image img');
      const captionElement = document.querySelector('.parallax-gallery-caption');
      
      if (!parallaxSection || !textElement || !imageElement || !captionElement) return;

     
      const OVERLAY_COLOR = 'rgba(255, 124, 95, 0.8)'; // Last number sets the opacity

      // Create parallax effect for image (moves up slower)
      gsap.to(imageElement, {
        y: -150, // Moves up as you scroll down
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Create parallax effect for caption (moves down slower)
      gsap.to(captionElement, {
        y: 150, // Moves down slower than scroll
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxSection,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        }
      });

      // Animate text color with sharp color change based on image overlap
      const colorTrigger = ScrollTrigger.create({
        trigger: parallaxSection,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5, // Smooth scrubbing
        onUpdate: () => {
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
            const topPercent = ((overlapTop - textRect.top) / textRect.height) * 100;
            const bottomPercent = ((overlapBottom - textRect.top) / textRect.height) * 100;
            
            // Calculate percentages for horizontal gradient  
            const leftPercent = ((overlapLeft - textRect.left) / textRect.width) * 100;
            const rightPercent = ((overlapRight - textRect.left) / textRect.width) * 100;
            
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
            
            gsap.to(textElement, { 
              backgroundImage: gradient,
              backgroundClip: 'text',
              webkitBackgroundClip: 'text',
              webkitTextFillColor: 'transparent',
              backgroundBlendMode: 'multiply',
              duration: 0.1,
              ease: 'none'
            });
          } else {
            // Reset to normal black text with smooth transition
            gsap.to(textElement, { 
              backgroundImage: 'none',
              backgroundClip: 'unset',
              webkitBackgroundClip: 'unset',
              webkitTextFillColor: 'unset',
              color: 'var(--black)',
              duration: 0.1,
              ease: 'none'
            });
          }
        }
      });

      return () => {
        ScrollTrigger.getAll().forEach(trigger => {
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
            home
          </a>
          <a href="/about" onClick={(e) => handleLinkClick(e, "/about")}>
            about
          </a>
          <a href="/work" onClick={(e) => handleLinkClick(e, "/work")}>
            work
          </a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")}>
            contact
          </a>
        </div>
      </nav>

      {/* Hero Grid Section */}

      <section className="hero-grid-section">
        <div className="hero-grid-container">
          <div className="hero-grid">
            <div className="hero-grid-header">
              <h1 style={{ position: "relative" }}>
                <span className="serif">m</span>irko
                <img
                  src="/nier.gif"
                  alt=""
                  className="earth-gif"
                  style={{
                    display: "block",
                    width: "6.5rem",
                    height: "6.5rem",
                    position: "absolute",
                    right: "21rem",
                    top: "0.5rem",
                  }}
                />
              </h1>
            </div>
            <div className="hero-grid-text">
              <p>
                Hi. I'm a{" "}
                <span className="colored-background-variant-1">code-based</span>{" "}
                web developer with a passion for interactive and{" "}
                <span className="colored-background-variant-1">fun</span> web
                experiences.
              </p>
            </div>
            <div className="hero-grid-cta">
              <button
                className="blog-article-button"
                style={{ fontSize: "1.2rem" }}
                onClick={() =>
                  (window.location.href = "mailto:mirkomimap@gmail.com")
                }
              >
                GET IN TOUCH
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Animation Section */}
      <section className="komparacija">
        <div className="komparacija-header">
          <h1>
            I build digital spaces meant to be{" "}
            <span className="serif">explored.</span>
          </h1>
        </div>
        <div className="komparacija-slike">
          <div className="komparacija-img">
            <img src="/circle1.jpg" alt="Picture 1" />
          </div>
          <div className="komparacija-img">
            <img src="/nier.gif" alt="Picture 2" />
          </div>
          <div className="komparacija-img">
            <img src="/circle2.jpg" alt="Picture 3" />
          </div>
          <div className="komparacija-img">
            <img src="/circle4.jpg" alt="Picture 4" />
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
                <span className="serif">w</span>orks.
              </h1>
            </div>
          </section>

          {/* Panel 2 - Two Stacked Images */}
          <section className="horizontal-panel panel-black panel-stacked">
            <figure>
              <a
                href="https://example.com/charity"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle1.jpg" alt="Screening project" />
              </a>
              <figcaption>placeholder 01.</figcaption>
            </figure>
            <figure>
              <a
                href="https://example.com/school"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle2.jpg" alt="Residency project" />
              </a>
              <figcaption>placeholder 02.</figcaption>
            </figure>
          </section>

          {/* Panel 3 - One Big Image */}
          <section className="horizontal-panel panel-black panel-big-image">
            <figure>
              <a
                href="https://example.com/jony-ive"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src="/circle3.jpg" alt="Featured project" />
              </a>
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
              <figcaption>placeholder 04.</figcaption>
            </figure>
            
            <a
              href="/work"
              className="link"
            >
             All of my works &#8594;
            </a>
          </section>
        </div>
      </div>

      {/* Styled header with svgs and mouth animation */}
      <section
        ref={mouthSectionRef}
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          position: "sticky",
          top: 0,
          zIndex: 11,
        }}
      >
        {/* White background layer */}
        <div
          style={{
            zIndex: 1,
          }}
        />
        {/* Mouth overlays and header content above grain */}
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 11,
          }}
        >
          <div
            className="mouth-overlay mouth-top"
            style={
              mouthLocked
                ? {
                    transform: `rotate(${
                      -45 * mouthProgress + (-2.5 + 5 * mouseMouthProgress)
                    }deg)`,
                    transformOrigin: "left center",
                  }
                : {
                    transform: `rotate(${-45 * mouthProgress}deg)`,
                  }
            }
          />
          <div
            className="mouth-overlay mouth-bottom"
            style={
              mouthLocked
                ? {
                    transform: `rotate(${
                      45 * mouthProgress + (-2.5 + 5 * mouseMouthProgress)
                    }deg)`,
                    transformOrigin: "left center",
                  }
                : {
                    transform: `rotate(${45 * mouthProgress}deg)`,
                  }
            }
          />
          <div
            style={{
              position: "relative",
              maxWidth: "900px",
              marginRight: "-10%",
              textAlign: "right",
              zIndex: 11,
            }}
          >
            <h3 style={{ position: "relative", zIndex: 11 }}>
              {/* First text with moving images parallax */}I have a love for
              optimizing the{" "}
              <span className="colored-background-variant-1">f*#+</span> out of
              user interfaces, making sure that good design does not compromise
              performance.
              <img
                  src="/nier.gif"
                  alt=""
                  className="earth-gif"
                  style={{
                    display: "block",
                    width: "8rem",
                    height: "8rem",
                    position: "absolute",
                    right: "-9rem",
                    bottom: "18.5rem",
                  }}
                />
            </h3>
          </div>
        </div>
      </section>

      {/* Second text with moving images parallax */}
      <section
        className="parallax-gallery"
        style={{ marginTop: "60vh" }} // Adjust this value to control when the parallax appears after mouth closes
      >
        <div
          style={{
            zIndex: 12,
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        />
        <div
          className="parallax-gallery-inner"
          style={{ position: "relative", zIndex: 12 }}
        >
          <div className="parallax-gallery-text">
            <h3>
              A coding approach gives me the
              flexibility to differently tackle any challenges on the project,
              blending efficiency with{" "}
              creativity.
            </h3>
          </div>
          <div className="parallax-gallery-image">
            <img src="/circle5.jpg" alt="Gallery placeholder" />
          </div>
          <p className="parallax-gallery-caption">
            I use modern libraries and frameworks to develop the best solution
            for your project.
          </p>
        </div>
      </section>

      {/* Footer with Folders */}
      <div
        className="folders"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          backgroundPosition: "-1px -1px",
          backgroundColor: "var(--white)",
        }}
      >
        <h1
          style={{
            marginLeft: "3rem",
            marginTop: "1rem",
            fontFamily: "Playfair Display, serif",
            color: "var(--black)",
          }}
        >
          Made by <span className="serif">m</span>irko.
        </h1>
        <div className="row">
          <div className="folder variant-1" data-link="/work">
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
              <div className="folder-index">
                <p>01</p>
              </div>
              <div className="folder-name">
                <h1>work</h1>
              </div>
            </div>
          </div>
          <div
            className="folder variant-2"
            data-link="https://github.com/m3Mza"
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
                <h1>contact</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
