import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import "./responsive.css";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

{
  /* Spotify Now Playing Widget */
}

// Spotify Embed - Shows a random track from your public playlist
const SPOTIFY_PLAYLIST_ID = "2Qf7TlWILWKeQi6bGfq44F"; // Your playlist ID

function NowPlayingSpotify() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomTrack = async () => {
      try {
        // Fetch playlist embed data (public, no auth required)
        const response = await fetch(
          `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}`
        );

        if (!response.ok) {
          console.error("Failed to fetch playlist");
          setIsLoading(false);
          return;
        }

        // For public playlists, we'll use the Spotify embed widget instead
        // This doesn't require OAuth and works for public playlists
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching Spotify data:", error);
        setIsLoading(false);
      }
    };

    fetchRandomTrack();
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="now-playing-spotify-embed">
      <iframe
        style={{ borderRadius: "12px" }}
        src={`https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`}
        width="100%"
        height="152"
        frameBorder="0"
        allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
}

function App() {
  const [isMenuActive, setIsMenuActive] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const [mouthProgress, setMouthProgress] = useState(0);
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

  // Mouth animation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const section = mouthSectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight && rect.bottom >= 0) {
        const sectionHeight = rect.height;
        const visibleTop = Math.max(0, windowHeight - rect.top);
        const rawProgress = (visibleTop / sectionHeight - 0.5) / 0.7;
        const progress = Math.min(1, Math.max(0, rawProgress));

        setMouthProgress(progress);
      } else if (rect.bottom < 0) {
        setMouthProgress(1);
      } else {
        setMouthProgress(0);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const isDesktop = window.innerWidth >= 768;
    const isInternal = href.startsWith("/");
    if (isDesktop) {
      setIsPageTransition(true);
      sessionStorage.setItem("pageTransition", "true");
      setTimeout(() => {
        if (href.startsWith("http")) {
          window.open(href, "_blank");
          sessionStorage.removeItem("pageTransition");
        } else if (href.startsWith("#")) {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          sessionStorage.removeItem("pageTransition");
          setIsPageTransition(false);
          setIsMenuActive(false);
        } else if (isInternal) {
          navigate(href);
          return;
        } else {
          window.location.href = href;
        }
      }, 800);
    } else {
      setIsMenuActive(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else if (href.startsWith("#")) {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else if (isInternal) {
        navigate(href);
        return;
      } else {
        window.location.href = href;
      }
    }
  };

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // GSAP ScrollTrigger animation for images
  useEffect(() => {
    // Wait a bit for DOM to be fully ready
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
        [-240, -5], // Image 1: far left
        [-120, -5], // Image 2: mid left
        [20, -5], // Image 3: mid right
        [140, -5], // Image 4: far right
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

    const timeout = setTimeout(() => {
      const animation = initAnimation();

      return () => {
        if (animation) {
          animation.scrollTrigger.kill();
          gsap.ticker.remove((time) => {
            animation.lenisKomparacija.raf(time * 1000);
          });
          animation.lenisKomparacija.destroy();
        }
      };
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Folder hover animation
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

    folders.forEach((folder, index) => {
      const previewImages = folder.querySelectorAll(".folder-preview-img");

      // Handle folder click for links
      folder.addEventListener("click", () => {
        const link = folder.getAttribute("data-link");
        const mailto = folder.getAttribute("data-mailto");
        const pdf = folder.getAttribute("data-pdf");

        if (link) {
          if (link.startsWith("http")) {
            window.open(link, "_blank");
          } else {
            window.location.href = link;
          }
        } else if (mailto) {
          window.location.href = `mailto:${mailto}`;
        } else if (pdf) {
          window.open(pdf, "_blank");
        }
      });

      folder.addEventListener("mouseenter", () => {
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
      });

      folder.addEventListener("mouseleave", () => {
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
      });
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

    // ====================================
    // TIMEOUT: Wait for DOM and other animations to initialize
    // ====================================
    // ADJUST: Increase this value if animation is twitchy (try 500, 1000, or 1500)
    // This ensures the komparacija ScrollTrigger above is fully initialized first
    const initDelay = 200;

    const timeoutId = setTimeout(() => {
      // ====================================
      // SCROLLTRIGGER SETUP
      // ====================================
      const scrollTrigger = ScrollTrigger.create({
     
        trigger: container,

        // ====================================
        // START: When the animation begins
        // ====================================
        // ADJUST: When to start the horizontal scroll
        // Current: 'top top' = starts when top of container hits top of viewport
        //
        // OTHER OPTIONS:
        // 'top center' = starts when top of container hits center of viewport (LATER)
        // 'top bottom' = starts when top of container hits bottom of viewport (MUCH LATER)
        // 'top top+=200px' = starts 200px AFTER container hits top (add delay)
        // 'top top-=200px' = starts 200px BEFORE container hits top (start earlier)
        //
        // FIX FOR TWITCHING: Try 'top top+=100px' to add delay after komparacija finishes
        start: "top top",

        // ====================================
        // END: When the animation completes
        // ====================================
        // ADJUST: How much scroll distance = full horizontal animation
        // Current: window.innerWidth * 1.5 = 1.5 viewport widths of scrolling
        //
        // FORMULA: For 2 sections, you need (sections - 1) * viewport width
        // So for 2 sections: 1 * viewport width minimum
        //
        // Multiplier effect:
        // * 1.0 = FAST (minimal scrolling needed)
        // * 1.5 = MEDIUM (current setting - good balance)
        // * 2.0 = SLOW (more scrolling needed to complete animation)
        // * 2.5 = VERY SLOW (lots of scrolling)
        end: () => `+=${window.innerWidth * 1.5}`,

        // ====================================
        // PIN: Lock the section in place
        // ====================================
        // true = Container stays fixed while user scrolls (creates horizontal effect)
        // false = Container scrolls normally (no horizontal effect)
        pin: true,

        // ====================================
        // PIN SPACING: Add space after pinned section
        // ====================================
        // true = Adds empty space after this section so content below shows naturally
        // false = No spacing, might cause content overlap
        //
        // IMPORTANT: If you have multiple pinned sections (like komparacija + this),
        // having pinSpacing: true on BOTH can cause layout jumps and twitching
        //
        // FIX FOR TWITCHING: Try setting this to false and see if it helps
        pinSpacing: true,

        // ====================================
        // SCRUB: Animation smoothness
        // ====================================
        // ADJUST: How smooth/responsive the animation feels
        //
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

  return (
    <>
      {/* Navigation Header */}
      <header className="nav-header">
        <div className="nav-header-content">
          <button
            className="nav-menu-toggle"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            {isMenuActive ? "Close." : "Menu."}
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
            Home.
          </a>
          <a href="/about" onClick={(e) => handleLinkClick(e, "/about")}>
            About.
          </a>
          <a href="/work" onClick={(e) => handleLinkClick(e, "/work")}>
            Work.
          </a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")}>
            Contact&#10174;
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
                  src="/earth.gif"
                  alt=""
                  className="earth-gif"
                  style={{
                    display: "block",
                    width: "3.5rem",
                    height: "3.5rem",
                    position: "absolute",
                    right: "-4rem",
                    top: "10rem",
                  }}
                />
              </h1>
            </div>
            <div className="hero-grid-text">
              <p>
                Hi. I'm a web developer with a passion for{" "}
                <span className="serif">interactive</span> and{" "}
                <span className="colored-background-variant-1">fun</span> web
                experiences.
              </p>
            </div>
            <div className="hero-grid-cta">
              <button
                className="blog-article-button"
                style={{ fontSize: "1.2" }}
                onClick={() =>
                  (window.location.href = "mailto:mirkomimap@gmail.com")
                }
              >
                GET IN TOUCH &#x2709;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Animation Section */}
      <section className="komparacija">
        <div className="komparacija-header">
          <h1>
            I create websites that are <span className="serif">explored</span>,
            not <span className="colored-background-variant-3">scrolled</span>
          </h1>
        </div>
        <div className="komparacija-slike">
          <div className="komparacija-img">
            <img src="/circle1.jpg" alt="Picture 1" />
          </div>
          <div className="komparacija-img">
            <img src="/circle2.jpg" alt="Picture 2" />
          </div>
          <div className="komparacija-img">
            <img src="/circle3.jpg" alt="Picture 3" />
          </div>
          <div className="komparacija-img">
            <img src="/circle4.jpg" alt="Picture 4" />
          </div>
        </div>
      </section>

      {/* Horizontal Scroll Container */}
      <div ref={horizontalScrollRef} className="horizontal-scroll-container">
        <div className="horizontal-panels">
          {/* Section 1 - Vinyl */}
          <section className="horizontal-panel">
            <div className="grid-content-container">
              <div className="grid-content-left">
                <div className="vinyl-container">
                  <img
                    src="/vinyl.png"
                    alt="Spinning vinyl record"
                    className="vinyl-record"
                  />
                  <NowPlayingSpotify />
                </div>
              </div>
              <div className="grid-content-right">
                <h1 className="vinyl-section-header">
                  Giving the{" "}
                  <span className="colored-background-variant-1"> UI </span>
                  <br />a spin.
                </h1>
                <p className="vinyl-section-desc">
                  I believe unconventional and fun websites come of as{" "}
                  <span className="serif">more sincere</span>
                </p>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="horizontal-panel">
            <div className="grid-content-container">
              <div className="grid-content-left section-2-left">
                <img
                  src="/circle1.jpg"
                  alt="Image 1"
                  className="random-img random-img-1"
                />
                <img
                  src="/circle2.jpg"
                  alt="Image 2"
                  className="random-img random-img-2"
                />
                <img
                  src="/circle3.jpg"
                  alt="Image 3"
                  className="random-img random-img-3"
                />
                <img
                  src="/circle4.jpg"
                  alt="Image 4"
                  className="random-img random-img-4"
                />
              </div>
              <div className="grid-content-right section-2-right">
                <h1>
                  <span className="serif">Fun </span> websites stay in folk's
                  minds just a little{" "}
                  <span className="colored-background-variant-3">
                    l&#x263A;nger
                  </span>
                </h1>
              </div>
            </div>
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
          position: "relative",
        }}
      >
        <div
          className="mouth-overlay mouth-top"
          style={{
            transform: `rotate(${-45 * mouthProgress}deg)`,
          }}
        />
        <div
          className="mouth-overlay mouth-bottom"
          style={{
            transform: `rotate(${45 * mouthProgress}deg)`,
          }}
        />
        <div
          style={{
            position: "relative",
            textAlign: "center",
            maxWidth: "900px",
            padding: "0 2rem",
            zIndex: 1,
          }}
        >
          <h2 style={{ position: "relative", zIndex: 1 }}>
            Thinking about showing your <span className="serif">business</span>{" "}
            to the <span className="serif">web?</span>
            <br></br>
            Being{" "}
            <span className="colored-background-variant-3">
              code-based
            </span>{" "}
            gives me the flexibility to translate your ideas into reality using
            <img
              src="/javascript-logo-svgrepo-com.svg"
              alt=""
              style={{
                display: "inline",
                width: "70px",
                height: "70px",
                marginLeft: "4px",
                marginRight: "4px",
                verticalAlign: "middle",
              }}
            />
            and libraries like{" "}
            <img
              src="/react-svgrepo-com.svg"
              alt=""
              style={{
                display: "inline",
                width: "70px",
                height: "70px",
                marginLeft: "4px",
                marginRight: "4px",
                verticalAlign: "middle",
              }}
            />{" "}
            and
            <span
              style={{
                display: "inline-block",
                verticalAlign: "middle",
                marginBottom: "10px",
                marginLeft: "5px",
                marginRight: "4px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                fill="none"
                viewBox="0 0 82 30"
              >
                <path
                  fill="#0ae448"
                  d="M23.81 14.013v.013l-1.075 4.665c-.058.264-.322.458-.626.458H20.81a.218.218 0 0 0-.208.155c-1.198 4.064-2.82 6.858-4.962 8.535-1.822 1.428-4.068 2.093-7.069 2.093-2.696 0-4.514-.867-6.056-2.578C.478 25.09-.364 21.388.146 16.926 1.065 8.549 5.41.096 13.776.096c2.545-.023 4.543.762 5.933 2.33 1.47 1.657 2.216 4.154 2.22 7.421a.55.55 0 0 1-.549.536h-6.13a.42.42 0 0 1-.407-.41c-.05-2.259-.72-3.36-2.052-3.36-2.35 0-3.736 3.19-4.471 4.959-1.027 2.47-1.55 5.152-1.447 7.824.049 1.244.249 2.994 1.43 3.718 1.047.643 2.541.217 3.446-.495.904-.711 1.632-1.942 1.938-3.065.043-.156.046-.277.005-.332-.043-.055-.162-.068-.253-.068h-1.574a.572.572 0 0 1-.438-.202.42.42 0 0 1-.087-.362l1.076-4.674c.053-.24.27-.42.537-.453v-.011h10.33c.024 0 .049 0 .072.005.268.034.457.284.452.556h.002Z"
                />
                <path
                  fill="#0ae448"
                  d="M41.594 8.65a.548.548 0 0 1-.548.531H35.4c-.37 0-.679-.3-.679-.665 0-1.648-.57-2.45-1.736-2.45s-1.918.717-1.94 1.968c-.025 1.395.764 2.662 3.01 4.84 2.957 2.774 4.142 5.232 4.085 8.48C38.047 26.605 34.476 30 29.042 30c-2.775 0-4.895-.743-6.305-2.207-1.431-1.486-2.087-3.668-1.95-6.485a.548.548 0 0 1 .549-.53h5.84a.55.55 0 0 1 .422.209.48.48 0 0 1 .106.384c-.065 1.016.112 1.775.512 2.195.256.272.613.41 1.058.41 1.079 0 1.711-.763 1.735-2.09.02-1.148-.343-2.155-2.321-4.19-2.555-2.496-4.846-5.075-4.775-9.13.042-2.351.976-4.502 2.631-6.056C28.294.868 30.687 0 33.465 0c2.783.02 4.892.813 6.269 2.359 1.304 1.466 1.932 3.582 1.862 6.29h-.002Z"
                />
                <path
                  fill="#0ae448"
                  d="m59.096 29.012.037-27.932a.525.525 0 0 0-.529-.533h-8.738c-.294 0-.423.252-.507.42L36.707 28.842v.005l-.005.006c-.14.343.126.71.497.71h6.108c.33 0 .548-.1.656-.308l1.213-2.915c.149-.388.177-.424.601-.424h5.836c.406 0 .415.008.408.405l-.131 2.71a.525.525 0 0 0 .529.532h6.17a.522.522 0 0 0 .403-.182.458.458 0 0 0 .104-.369Zm-10.81-9.326c-.057 0-.102-.001-.138-.005a.146.146 0 0 1-.13-.183c.012-.041.029-.095.053-.163l4.377-10.827c.038-.107.086-.212.136-.314.071-.145.157-.155.184-.047.023.09-.502 11.118-.502 11.118-.041.413-.06.43-.467.464l-3.509-.041h-.008l.003-.002Z"
                />
                <path
                  fill="#0ae448"
                  d="M71.545.547h-4.639c-.245 0-.52.13-.585.422l-6.455 28.029a.423.423 0 0 0 .088.364.572.572 0 0 0 .437.202h5.798c.311 0 .525-.153.583-.418 0 0 .703-3.168.704-3.178.05-.247-.036-.439-.258-.555-.105-.054-.209-.108-.312-.163l-1.005-.522-1-.522-.387-.201a.186.186 0 0 1-.102-.17.199.199 0 0 1 .198-.194l3.178.014c.95.005 1.901-.062 2.836-.234 6.58-1.215 10.95-6.485 11.076-13.656.107-6.12-3.309-9.221-10.15-9.221l-.005.003Zm-1.579 16.68h-.124c-.278 0-.328-.03-.337-.04-.004-.007 1.833-8.073 1.834-8.084.047-.233.045-.367-.099-.446-.184-.102-2.866-1.516-2.866-1.516a.188.188 0 0 1-.101-.172.197.197 0 0 1 .197-.192h4.241c1.32.04 2.056 1.221 2.021 3.237-.061 3.492-1.721 7.09-4.766 7.214Z"
                />
              </svg>
              .
            </span>{" "}
          </h2>
        </div>
      </section>

      {/* Footer with Folders */}
      <div className="folders">
        <h2 className="folders-header">
          <span className="colored-background-variant-1">Everything</span> you
          need to know about <span className="serif">Mirko</span>, tidily
          packed.
        </h2>
        <div className="row">
          <div className="folder variant-1" data-link="/work">
            <div className="folder-preview">
              <div className="folder-preview-img">
                <img src="/gridSistemi.jpg" alt="Grid Systems" />
              </div>
              <div className="folder-preview-img">
                <img src="/poster7.jpg" alt="Poster 7" />
              </div>
              <div className="folder-preview-img">
                <img src="/poster8.jpg" alt="Poster 8" />
              </div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index">
                <p>01</p>
              </div>
              <div className="folder-name">
                <h1>Work</h1>
              </div>
            </div>
          </div>
          <div
            className="folder variant-2"
            data-link="https://github.com/m3Mza"
          >
            <div className="folder-preview">
              <div className="folder-preview-img">
                <img src="/gitDark.svg" alt="GitHub Dark" />
              </div>
              <div className="folder-preview-img">
                <img src="/gitLight.svg" alt="GitHub Light" />
              </div>
              <div className="folder-preview-img">
                <img src="/gitDark.svg" alt="GitHub Dark" />
              </div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index">
                <p>02</p>
              </div>
              <div className="folder-name">
                <h1>GitHub</h1>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="folder variant-2" data-link="/about">
            <div className="folder-preview">
              <div className="folder-preview-img">
                <img src="/mirko1.jpeg" alt="Resume 1" />
              </div>
              <div className="folder-preview-img">
                <img src="/mirko2.jpeg" alt="Resume 2" />
              </div>
              <div className="folder-preview-img">
                <img src="/mirko3.jpeg" alt="Resume 3" />
              </div>
            </div>
            <div className="folder-wrapper">
              <div className="folder-index">
                <p>03</p>
              </div>
              <div className="folder-name">
                <h1>About</h1>
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
                <h1>Contact &#10174;</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
