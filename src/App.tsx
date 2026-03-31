import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import ScrambleHover from "./components/ScrambleHover";
import LenisScrollContainer from "./components/LenisScrollContainer";
import type { LenisScrollRef } from "./components/LenisScrollContainer";
import 'lenis/dist/lenis.css';

const baseProjects = [
 
  {
    title: "miyajlo.vercel.app",
    year: "2025",
    link: "https://miyajlo.vercel.app/",
    img: "/miyalo.gif",
    type: "portfolio website",
    whatIDid: ["web design", "web development"],
    client: "miyajlo",
    clientYear: "2025",
    role: "solo developer",
  },
];

function App() {
  const heroContainerRef = useRef<HTMLDivElement>(null);

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
  const [selectedProject, setSelectedProject] = useState<typeof baseProjects[0] | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detailVideoRef = useRef<HTMLVideoElement>(null);
  const scrollContainerRef = useRef<LenisScrollRef>(null);
  const detailScrollRef = useRef<LenisScrollRef>(null);
  
  const handleWorkHover = (img: string) => {
    if (window.innerWidth <= 768) return;
    setHoverImg(img);
  };
  
  const handleWorkLeave = () => {
    if (window.innerWidth <= 768) return;
    setHoverImg(null);
  };

  useEffect(() => {
    if (hoverImg?.endsWith('.mov') && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [hoverImg]);

  const handleProjectListScroll = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile || !scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
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

  useEffect(() => {
    if (selectedProject?.img.endsWith('.mov') && detailVideoRef.current) {
      detailVideoRef.current.play().catch(() => {});
    }
  }, [selectedProject]);

  return (
    <>
      {/* Hero Grid Section */}
      <section className="hero-grid-section" ref={heroContainerRef}>
        <div className="hero-split-container">
          {/* Project Detail Overlay */}
          {selectedProject && (
            <div className="project-detail-overlay">
              <LenisScrollContainer
                ref={detailScrollRef}
                className="project-detail-scroll-container"
              >
                <div className="project-detail-header">
                  <div className="project-info-grid">
                    <div className="project-info-item">
                      <p className="project-info-label">(1) job/project</p>
                      <p className="project-info-value">{selectedProject.title}</p>
                    </div>
                    <div className="project-info-item">
                      <p className="project-info-label">(2) what i did</p>
                      <p className="project-info-value">{selectedProject.role}</p>
                    </div>
                    <div className="project-info-item">
                      <p className="project-info-label">(3) year</p>
                      <p className="project-info-value">{selectedProject.year}</p>
                    </div>
                    <div className="project-info-item">
                      <p className="project-info-label">(4) link</p>
                      {selectedProject.link ? (
                        <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" className="project-info-link">
                          {selectedProject.link.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <p className="project-info-value">—</p>
                      )}
                    </div>
                  </div>
                  <button 
                    className="project-detail-close-btn"
                    onClick={() => setSelectedProject(null)}
                  >
                    [X]
                  </button>
                </div>
                <div className="project-detail-content">
                  {/* Image 1 - Top Left */}
                  <div className="project-image" style={{ top: '300px', left: '10%' }}>
                    {selectedProject.img.endsWith('.mov') ? (
                      <video
                        ref={detailVideoRef}
                        src={selectedProject.img}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img src={selectedProject.img} alt={selectedProject.title} />
                    )}
                  </div>
                  {/* Image 2 - Middle Right */}
                  <div className="project-image" style={{ top: '800px', left: '50%' }}>
                    {selectedProject.img.endsWith('.mov') ? (
                      <video
                        src={selectedProject.img}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img src={selectedProject.img} alt={selectedProject.title} />
                    )}
                  </div>
                  {/* Image 3 - Lower Left */}
                  <div className="project-image" style={{ top: '1400px', left: '15%' }}>
                    {selectedProject.img.endsWith('.mov') ? (
                      <video
                        src={selectedProject.img}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img src={selectedProject.img} alt={selectedProject.title} />
                    )}
                  </div>
                  {/* Image 4 - Bottom Right */}
                  <div className="project-image" style={{ top: '2000px', left: '45%' }}>
                    {selectedProject.img.endsWith('.mov') ? (
                      <video
                        src={selectedProject.img}
                        muted
                        loop
                        autoPlay
                        playsInline
                      />
                    ) : (
                      <img src={selectedProject.img} alt={selectedProject.title} />
                    )}
                  </div>
                  {/* Spacer to ensure scroll height */}
                  <div style={{ height: '2500px' }}></div>
                </div>
              </LenisScrollContainer>
            </div>
          )}
          
          <div className="hero-left-side" style={{ opacity: selectedProject ? 0 : 1, pointerEvents: selectedProject ? 'none' : 'auto' }}>
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
              <img 
                src="/arrow-elbow-down-right.svg" 
                alt="arrow" 
                style={{
                  width: '0.9rem',
                  height: '0.9rem',
                  marginRight: '4px',
                  marginBottom: '2px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  filter: 'invert(1) brightness(2)',
                }}
              />
              <ScrambleHover text="follow me on X" scrambleSpeed={50} maxIterations={8} />
            </a>
            <a className="hero-grid-small-text" href="mailto:mirkomimap@gmail.com" target="_blank" rel="noopener noreferrer">
              <img 
                src="/arrow-elbow-down-right.svg" 
                alt="arrow" 
                style={{
                  width: '0.9rem',
                  height: '0.9rem',
                  marginRight: '4px',
                  marginBottom: '2px',
                  display: 'inline-block',
                  verticalAlign: 'middle',
                  filter: 'invert(1) brightness(2)',
                }}
              />
              <ScrambleHover text="mail: mirkomimap@gmail.com" scrambleSpeed={50} maxIterations={8} />
            </a>
          </div>
          <div className="projects-right-side">
            <LenisScrollContainer
              ref={scrollContainerRef}
              className="projects-scroll-container"
              onScroll={handleProjectListScroll}
            >
              <div className="projects-list">
                {projects.map((work) => (
                  <div key={work.id} className="project-item">
                    <a
                      href="#"
                      className="project-link"
                      onMouseEnter={() => handleWorkHover(work.img)}
                      onMouseLeave={handleWorkLeave}
                      onClick={(e) => {
                        e.preventDefault();
                        const baseProject = baseProjects.find(p => p.title === work.title);
                        if (baseProject) {
                          setSelectedProject(baseProject);
                        }
                      }}
                    >
                      <span className="project-name">
                        <ScrambleHover 
                          text={`${work.title} (${work.year})`} 
                          scrambleSpeed={75} 
                          maxIterations={5} 
                        />
                      </span>
                    </a>
                  </div>
                ))}
              </div>
            </LenisScrollContainer>
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
