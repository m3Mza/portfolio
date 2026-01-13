import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenisScroll from "./hooks/useLenisScroll";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import useKomparacijaAnimation from "./hooks/useKomparacijaAnimation";
import useSelectedWorksParallax from "./hooks/useSelectedWorksParallax";
import useParallaxGallery from "./hooks/useParallaxGallery";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isTransitioning = sessionStorage.getItem("pageTransition");
    if (isTransitioning === "true") {
      sessionStorage.removeItem("pageTransition");

      setTimeout(() => {
        setIsPageTransition(false);
        setIsReturning(true);

        setTimeout(() => {
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

    if (isInternal && currentPath === href) {
      setIsMenuActive(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
      return;
    }

    if (isDesktop && isInternal) {
      setIsPageTransition(true);
      sessionStorage.setItem("pageTransition", "true");

      setTimeout(() => {
        window.location.href = href;
      }, 800);
    } else if (isDesktop) {
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
      setIsMenuActive(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else if (href.startsWith("#")) {
        if (href === "#contact") {
          window.location.href = "mailto:mirkomimap@gmail.com";
        } else {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        }
      } else if (isInternal) {
        setTimeout(() => {
          window.location.href = href;
        }, 100);
      } else {
        window.location.href = href;
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  // Initialize all effects
  useLenisScroll();
  useImageTrailEffect({ containerRef: heroContainerRef });
  useKomparacijaAnimation();
  useSelectedWorksParallax();
  useParallaxGallery();

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
            {isMenuActive ? "Close" : "Menu"}
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
                    width: "8rem",
                    height: "8rem",
                    position: "absolute",
                    left: "10.7rem",
                    top: "0rem",
                  }}
                />
              </h1>
            </div>
            <div className="hero-grid-text">
              <p>
                I'm a front-end developer helping
                brands establish a strong online presence.
              </p>
            </div>
            <div className="hero-grid-cta">
              <a
                className="link"
                style={{ fontSize: "2.7rem" }}
                onClick={() =>
                  (window.location.href = "mailto:mirkomimap@gmail.com")
                }
              >
                Got a project?{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2.7rem"
                  height="2.7rem"
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
              I analyze human behavioral patterns to develop websites that are
              intuitive, pleasing to the eye and help brands maintain a powerful
              online presence.

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
            All of my work{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.4rem"
              height="1.4rem"
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
            <figure className="variant-1">
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
            <figure className="variant-1">
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
            <figure className="variant-1">
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
            <figure className="selected-works-big-image variant-1">
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
            <figure className="selected-works-big-image variant-1">
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
    
          </div>
          
          <div className="footer-column">
            <a href="mailto:mirkomimap@gmail.com" className="link">mail
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="1.4rem"
                  height="1.4rem"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
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

          </div>
        </div>
        
  
        
        <div className="footer-bottom">
          <p>© made with <span className="highlight-circle">love</span>, mirko, 2026.</p>
          <h1 className="footer-logo" style={{position: 'relative'}}>mirko</h1>
          <img
                  src="/nier.gif"
                  alt=""
                  className="earth-gif"
                  style={{
                    display: "block",
                    width: "16rem",
                    height: "16rem",
                    position: "absolute",
                    left: "26.5rem",
                    bottom: "14rem",
                  }}
                />
        </div>
      </footer>
    </>
  );
}

export default App;
