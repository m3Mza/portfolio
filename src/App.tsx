import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import ScrambleHover from "./components/ScrambleHover";


gsap.registerPlugin(ScrollTrigger);

const baseProjects = [
  {
    title: "zsemicolon.com",
    year: "2026",
    link: "",
    img: "/z.mov",
  },
  {
    title: "miyajlo.com",
    year: "2025",
    link: "https://miyajlo.vercel.app/",
    img: "/miyalo.gif",
  },
  {
    title: "placeholder.com",
    year: "2024",
    link: "https://example.com/3",
    img: "/img3.jpeg",
  },
  {
    title: "placeholder2.com",
    year: "2024",
    link: "https://example.com/3",
    img: "/img3.jpeg",
  },
  {
    title: "placeholder3.com",
    year: "2024",
    link: "https://example.com/3",
    img: "/img3.jpeg",
  },
];

function App() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    subject: "",
    message: ""
  });

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subject = encodeURIComponent(formData.subject);
    const body = encodeURIComponent(formData.message);
    window.location.href = `mailto:mirkomimap@gmail.com?subject=${subject}&body=${body}`;
    
    setFormData({ subject: "", message: "" });
    setIsMenuActive(false);
  };

  const toggleMenu = () => {
    // On mobile, directly open mailto
    if (window.innerWidth <= 768) {
      window.location.href = 'mailto:mirkomimap@gmail.com';
      return;
    }
    setIsMenuActive(!isMenuActive);
  };

  useImageTrailEffect({ containerRef: heroContainerRef });
  
  const [projects, setProjects] = useState(() => {
    const result: Array<typeof baseProjects[0] & { id: number }> = [];
    const isMobile = window.innerWidth <= 768;
    const repeatCount = isMobile ? 1 : 20; // Only show base projects once on mobile
    
    for (let i = 0; i < repeatCount; i++) {
      baseProjects.forEach((project, idx) => {
        result.push({ ...project, id: i * baseProjects.length + idx });
      });
    }
    return result;
  });

  const [hoverImg, setHoverImg] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleWorkHover = (img: string) => {
    // Disable hover effect on mobile
    if (window.innerWidth <= 768) return;
    setHoverImg(img);
  };
  
  const handleWorkLeave = () => {
    // Disable hover effect on mobile
    if (window.innerWidth <= 768) return;
    setHoverImg(null);
  };

  useEffect(() => {
    if (hoverImg?.endsWith('.mov') && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [hoverImg]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Disable infinite scroll on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) return;

    const checkScroll = () => {
      if (!container) return;

      const { scrollTop, scrollHeight, clientHeight } = container;
      
      if (scrollHeight - scrollTop - clientHeight <= clientHeight * 0.5) {
        setProjects(prev => {
          const newProjects = [...prev];
          const currentLength = newProjects.length;
          baseProjects.forEach((project, idx) => {
            newProjects.push({
              ...project,
              id: currentLength + idx
            });
          });
          return newProjects;
        });
      }
    };

    container.addEventListener('scroll', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
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
            aria-label="Toggle contact form"
          >
            {isMenuActive ? "close" : "send mail"}
          </button>
        </div>
      </header>

      {/* Contact Form Overlay */}
      <nav
        className={`nav-spotlight-menu ${isMenuActive ? "active" : ""} ${
          isPageTransition ? "page-transition" : ""
        } ${isReturning ? "returning" : ""}`}
      >
        <div className="nav-spotlight-background"></div>
        <div className="nav-spotlight-links">
          <form onSubmit={handleFormSubmit} style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            width: '100%',
            maxWidth: '600px',
            opacity: isMenuActive ? 1 : 0,
            transform: isMenuActive ? 'translateX(0)' : 'translateX(50px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            transitionDelay: isMenuActive ? '0.95s' : '0s',
            alignItems: 'flex-start'
          }}>
            
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="type subject here..."
              value={formData.subject}
              onChange={handleFormChange}
              required
              className="contact-form-input"
              style={{
                padding: '0.5rem',
                fontSize: '1.8rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0',
                color: 'var(--black)',
                fontFamily: 'inherit',
                width: '100%',
                outline: 'none'
              }}
            />
            
            <textarea
              id="message"
              name="message"
              placeholder="type message here..."
              value={formData.message}
              onChange={handleFormChange}
              required
              rows={4}
              className="contact-form-input"
              style={{
                padding: '0.5rem',
                fontSize: '1.8rem',
                background: 'transparent',
                border: 'none',
                borderRadius: '0',
                color: 'var(--black)',
                fontFamily: 'inherit',
                resize: 'none',
                width: '100%',
                outline: 'none'
              }}
            />
            
            <button
              type="submit"
              className="link"
              style={{
                padding: '0',
                fontSize: '1.8rem',
                background: 'transparent',
                color: 'var(--black)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                textTransform: 'none',
                letterSpacing: 'normal',
                alignSelf: 'flex-start'
              }}
            >
              <ScrambleHover text="click to send" scrambleSpeed={50} maxIterations={8} />
            </button>
          </form>
        </div>
      </nav>

      {/* Hero Grid Section */}
      <section className="hero-grid-section" ref={heroContainerRef}>
        <div className="hero-split-container">
          <div className="hero-left-side">
            <div className="hero-grid-header">
              <h1 className="title" style={{ 
                position: "relative"
              }}>
                <span className="mirk-text">MIRK</span>
                <span className="shared-o-wrapper">
                  <span className="shared-o">O</span>
                  <span className="vertical-before">POP</span>
                  <span className="vertical-after">VIC</span>
                </span>
              </h1>
            </div>
            <div className="hero-grid-description">
              <p>i make websites,</p>
              <p>sometimes apps.</p>
            </div>
            <a className="hero-grid-small-text" href="https://x.com/mirkosayshello" target="_blank" rel="noopener noreferrer">
              <ScrambleHover text="follow me on X " scrambleSpeed={50} maxIterations={8} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="0.9rem"
                height="0.9rem"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  marginLeft: '1px',
                  marginBottom: '2px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                }}
              >
                <path d="M18 6L6 18" />
                <path d="M8 6h10v10" />
              </svg>
            </a>
          </div>
          <div className="projects-right-side">
            <div 
              className="projects-scroll-container" 
              ref={scrollContainerRef}
            >
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--black)',
                marginBottom: '1rem',
                textDecoration: 'underline',
              }}>
                {typeof window !== 'undefined' && window.innerWidth <= 768 ? 'projects:' : 'projects (try scrolling):'} 
              </p>
              <div className="projects-list">
                {projects.map((work) => (
                  <div key={work.id} className="project-item">
                    <a
                      href={work.link || "#"}
                      className="project-link"
                      onMouseEnter={() => handleWorkHover(work.img)}
                      onMouseLeave={handleWorkLeave}
                    >
                      <span className="project-name">
                        <ScrambleHover 
                          text={`${work.title} (${work.year})`} 
                          scrambleSpeed={50} 
                          maxIterations={8} 
                        />
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1.2rem"
                        height="1.2rem"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="project-arrow"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M8 6h10v10" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {hoverImg && (
            <div className="hover-preview-left">
              {hoverImg.endsWith('.mov') ? (
                <video
                  ref={videoRef}
                  src={hoverImg}
                  muted
                  loop
                  autoPlay
                  playsInline
                />
              ) : (
                <img src={hoverImg} alt="Preview" />
              )}
            </div>
          )}
        </div>
      </section>


    </>
  );
}

export default App;
