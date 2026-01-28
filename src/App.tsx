import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useLenisScroll from "./hooks/useLenisScroll";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import useKomparacijaAnimation from "./hooks/useKomparacijaAnimation";


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

  // Selected works data
  const selectedWorks = [
  {
    title: "Lumeo",
    type: "Creative Agency",
    client: "Ava Collins",
    year: "2026",
    link: "https://lovefrom.com",
    imgs: ["/img1.jpeg", "/img2.jpeg", "/img3.jpeg"],
  },
  {
    title: "NexaWorks",
    type: "Design Studio",
    client: "Kai Johnson",
    year: "2025",
    link: "https://example.com/entrance",
    imgs: ["/img4.jpeg", "/img2.jpeg",],
  },
  {
    title: "Fiorenza",
    type: "Public",
    client: "Marco Rossi",
    year: "2024",
    link: "https://example.com/fitness",
    imgs: ["/img3.jpeg", "/img2.jpeg", "/img1.jpeg"],
  },
  {
    title: "Skydeck",
    type: "Architecture",
    client: "Liam Parker",
    year: "2023",
    link: "https://example.com/rooftop",
    imgs: ["/img4.jpeg", "/img2.jpeg", "/img3.jpeg"],
  },
  {
    title: "Ember",
    type: "Branding",
    client: "Zara Nguyen",
    year: "2018",
    link: "https://example.com/befimmo",
    imgs: ["/img5.jpeg", "/img2.jpeg", "/img3.jpeg"],
  },
  {
    title: "Co-Lab Hub",
    type: "Offices",
    client: "Global Corp",
    year: "2022",
    link: "https://example.com/coworking",
    imgs: ["/img6.jpeg", "/img3.jpeg"],
  },
  {
    title: "CraftPoint",
    type: "Offices",
    client: "Pixel Labs",
    year: "2025",
    link: "https://example.com/craftit",
    imgs: ["/img1.jpeg", "/img2.jpeg", "/img3.jpeg"],
  },
  {
    title: "Joybuy Nexus",
    type: "Offices",
    client: "Joybuy International",
    year: "2026",
    link: "https://example.com/joybuy",
    imgs: ["/img2.jpeg", "/img3.jpeg"],
  },
]

  // Hover image state
  const [hoverImgs, setHoverImgs] = useState<string[] | null>(null);
  const [hoverImgPositions, setHoverImgPositions] = useState<{ x: number; y: number }[] | null>(null);

  // Handle hover to show each image at its own random position
  const handleWorkHover = (imgs: string[]) => {
    const section = document.querySelector(".selected-works-section");
    if (section) {
      const rect = section.getBoundingClientRect();
      const positions = imgs.map(() => {
        const x = Math.floor(Math.random() * (rect.width - 140)); // 140px for image width
        const minY = rect.height / 3;
        const maxY = (rect.height * 2) / 3;
        const y = Math.floor(Math.random() * (maxY - minY) + minY);
        return { x, y };
      });
      setHoverImgs(imgs);
      setHoverImgPositions(positions);
    }
  };
  const handleWorkLeave = () => {
    setHoverImgs(null);
    setHoverImgPositions(null);
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
                MIRKO
              </h1>
            </div>
            <div className="hero-grid-text">
              <p>
                I'm a front-end developer helping people & brands
                establish a strong internet presence.
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
            <h2 className="hero-grid-small-text">
            Scroll down{" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="0.6rem"
              height="0.6rem"
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
        </div>
      </section>


      {/* Scroll Animation Section */}
      <section className="komparacija">
        <div className="komparacija-header">

          <h3 style={{ marginTop: "50vh" }}> Did you know that 75% of visitors will leave 
            a website after only 3 seconds? Let's fix that.
          </h3>
          
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

     
        {/* Selected Works Section */}
      <section className="selected-works-section" style={{ position: 'relative', minHeight: '100vh' }}>
        <div className="selected-works-header">
          <h3 className="selected-works-title">Some websites I made</h3>
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
                      onMouseEnter={() => handleWorkHover(work.imgs)}
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
          {hoverImgs && hoverImgPositions && (
  <>
    {hoverImgs.map((img, i) => (
      <img
        key={i}
        src={img}
        alt="Preview"
        style={{
          position: 'absolute',
          left: hoverImgPositions[i].x,
          top: hoverImgPositions[i].y,
          width: '200px',
          height: '180px',
          objectFit: 'cover',
          opacity: 1,
          transition: 'opacity 0.2s',
          pointerEvents: 'none',
          zIndex: 100,
        }}
      />
    ))}
  </>
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

        <a
          className="link"
          style={{ fontSize: "2.7rem", marginLeft: "1.6rem", marginTop: "-18%", width: "fit-content", padding: "0.5rem 0" }}
          onClick={() =>
            (window.location.href = "mailto:mirkomimap@gmail.com")
          }
        >
          Got an idea? Get in touch{" "}
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
        
        <div className="footer-bottom">
          <p>© made with <span className="highlight-circle">love</span>, 2026.</p>
          <h1 className="footer-logo">MIRKO</h1>
        </div>
      </footer>
    </>
  );
}

export default App;
