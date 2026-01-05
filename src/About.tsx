import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";

function About() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const navigate = useNavigate();

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
          setIsMenuActive(false); // Close menu right before navigation
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

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  /* =======================
==========================
FOLDER HOVER ANIMATIONS
==========================
========================== */

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
            {isMenuActive ? "close" : "menu"}
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

      {/* About Section */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-title">
            <h2>
              <span>a</span>bout.
              <img
                src="/nier.gif"
                alt=""
                className="earth-gif"
                style={{
                  display: "inline-block",
                  width: "10.1rem",
                  height: "10.1rem",
                  left: "39.6rem",
                  top: "7.5rem",
                  position: "absolute",
                }}
              />
            </h2>
          </div>
          <div className="about-text">
            <p>
              I'm a cook turned web developer with a BSc in <span className="salmon-background">Software Engineering</span>.
              {" "}I focus mainly on JavaScript and
              all its' bells and whistles (
              <span className="highlight-underline">
                GSAP, React, TypeScript, Vue, Node{" "}
              </span>
              ) but I also dabble in PHP from time to time. You can contact me
              at:
            </p>
            <a
              href="mailto:mirkomimap@gmail.com"
              className="link"
              style={{
                textAlign: "justify",
                gap: "0.5rem",
                marginLeft: "-1rem",
                marginTop: "1rem",
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
                fontSize: "1.4rem",
              }}
            >
              mirkomimap@gmail.com
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
                  marginLeft: "6px",
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
      </section>

      {/* Footer with Folders */}
      <div
        className="folders"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), " +
            "linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      >
        <h1
          style={{
            marginLeft: "3rem",
            marginBottom: "-4rem",
            fontWeight: 700,
            fontFamily: "Playfair Display, serif",
            color: "var(--black)",
          }}
        >
          links.
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
                <h1>contact</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
