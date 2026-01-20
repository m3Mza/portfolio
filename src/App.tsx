import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenisScroll from "./hooks/useLenisScroll";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import useKomparacijaAnimation from "./hooks/useKomparacijaAnimation";
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
  useParallaxGallery();

  // Selected works data
  const selectedWorks = [
  {
    title: "Lumeo",
    type: "Creative Agency",
    client: "Ava Collins",
    year: "2026",
    link: "https://lovefrom.com",
    img: "/img1.jpeg",
  },
  {
    title: "NexaWorks",
    type: "Design Studio",
    client: "Kai Johnson",
    year: "2025",
    link: "https://example.com/entrance",
    img: "/img2.jpeg",
  },
  {
    title: "Fiorenza",
    type: "Public",
    client: "Marco Rossi",
    year: "2024",
    link: "https://example.com/fitness",
    img: "/img3.jpeg",
  },
  {
    title: "Skydeck",
    type: "Architecture",
    client: "Liam Parker",
    year: "2023",
    link: "https://example.com/rooftop",
    img: "/img4.jpeg",
  },
  {
    title: "Ember",
    type: "Branding",
    client: "Zara Nguyen",
    year: "2018",
    link: "https://example.com/befimmo",
    img: "/img5.jpeg",
  },
  {
    title: "Co-Lab Hub",
    type: "Offices",
    client: "Global Corp",
    year: "2022",
    link: "https://example.com/coworking",
    img: "/img6.jpeg",
  },
  {
    title: "CraftPoint",
    type: "Offices",
    client: "Pixel Labs",
    year: "2025",
    link: "https://example.com/craftit",
    img: "/img1.jpeg",
  },
  {
    title: "Joybuy Nexus",
    type: "Offices",
    client: "Joybuy International",
    year: "2026",
    link: "https://example.com/joybuy",
    img: "/img2.jpeg",
  },
  {
    title: "Louise Horizon",
    type: "Offices",
    client: "Silversquare Group",
    year: "2024",
    link: "https://example.com/louise",
    img: "/img3.jpeg",
  },
  {
    title: "Shake-Spike Hub",
    type: "Offices",
    client: "Spike Innovations",
    year: "2025",
    link: "https://example.com/shake",
    img: "/img4.jpeg",
  },
  {
    title: "A-Tower Alpha",
    type: "Offices",
    client: "Silversquare",
    year: "2023",
    link: "https://example.com/atower",
    img: "/img5.jpeg",
  },
  {
    title: "Guillemins HQ",
    type: "Offices",
    client: "Silversquare",
    year: "2023",
    link: "https://example.com/guillemins",
    img: "/img6.jpeg",
  },
  {
    title: "Louvain Nova",
    type: "Offices",
    client: "Silversquare",
    year: "2024",
    link: "https://example.com/louvain",
    img: "/img1.jpeg",
  }
]

  // Hover image state
  const [hoverImg, setHoverImg] = useState<string | null>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // Handle hover to show image at random position
  const handleWorkHover = (img: string) => {
    const section = document.querySelector(".selected-works-section");
    if (section) {
      const rect = section.getBoundingClientRect();
      // Random position within section bounds
      const x = Math.floor(Math.random() * (rect.width - 240));
      const y = Math.floor(Math.random() * (rect.height + -240));
      setHoverPos({ x, y });
      setHoverImg(img);
    }
  };
  const handleWorkLeave = () => {
    setHoverImg(null);
  };

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
              </h1>
            </div>
            <div className="hero-grid-text">
              <p>
                I'm a front-end developer helping folks
                establish a web presence.
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
            <img src="/img1.jpeg" alt="Picture 1" />
          </div>
          <div className="komparacija-img">
            <img src="/img6.jpeg" alt="Picture 2" />
          </div>
          <div className="komparacija-img">
            <img src="/img2.jpeg" alt="Picture 3" />
          </div>
          <div className="komparacija-img">
            <img src="/img3.jpeg" alt="Picture 4" />
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
              I create intuitive and engaging user experiences,
              that won't have them leaving after a few scrolls by using
              human behavioral psychology tricks and well planned web layouts.

            </h3>
          </div>
          <div className="parallax-gallery-image">
            <img src="/img5.jpeg" alt="Gallery placeholder" />
          </div>
        </div>
      </section>

        {/* Selected Works Section */}
      <section className="selected-works-section" style={{ position: 'relative', minHeight: '100vh' }}>
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
                marginLeft: '1px',
                marginBottom: '4px',
                display: 'inline-block',
                verticalAlign: 'middle',
              }}
            >
              <path d="M18 6L6 18" />
              <path d="M8 6h10v10" />
            </svg>
          </a>
        </div>
        <div className="selected-works-simple-list" style={{ width: '100%', marginTop: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.4rem' }}>
            <tbody>
              {selectedWorks.map((work, idx) => (
                <tr key={idx}>
                  <td style={{ padding: '0.7rem 0', fontWeight: 'bold' }}>
                    <a
                      href={work.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link"
                      style={{ color: 'var(--black)', cursor: 'pointer' }}
                      onMouseEnter={() => handleWorkHover(work.img)}
                      onMouseLeave={handleWorkLeave}
                    >
                      {work.title}
                    </a>
                  </td>
                  <td style={{ padding: '0.7rem 0', color: 'var(--black)' }}>{work.type}</td>
                  <td style={{ padding: '0.7rem 0', color: 'var(--black)' }}>{work.client}</td>
                  <td style={{ padding: '0.7rem 0', color: 'var(--black)' }}>{work.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {hoverImg && (
            <img
              src={hoverImg}
              alt="Preview"
              style={{
                position: 'absolute',
                left: hoverPos.x,
                top: hoverPos.y,
                width: '300px',
                height: '300px',
                pointerEvents: 'none',
                zIndex: 100,
                transition: 'opacity 0.2s',
                opacity: 1,
              }}
            />
          )}
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
        </div>
      </footer>
    </>
  );
}

export default App;
