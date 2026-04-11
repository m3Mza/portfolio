import { useState, useRef, useEffect } from "react";
import "./App.css";
import "./responsive.css";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import LenisScrollContainer from "./components/LenisScrollContainer";
import type { LenisScrollRef } from "./components/LenisScrollContainer";
import 'lenis/dist/lenis.css';

// Function to dynamically load images from a folder
const loadProjectImages = (folderName: string): string[] => {
  const images = import.meta.glob('/public/**/*.{png,jpg,jpeg,gif,webp,mov,mp4}', { 
    eager: true,
    as: 'url' 
  });
  
  const folderPath = `/public/${folderName}/`;
  return Object.keys(images)
    .filter(path => path.startsWith(folderPath) && !path.includes('.DS_Store'))
    .map(path => path.replace('/public', ''))
    .sort();
};

const baseProjects = [
  {
    title: "miyajlo's website",
    year: "2025",
    link: "https://miyajlo.vercel.app/",
    img: "/miyajlo/miyajlo.mov",
    client: "miyajlo",
    clientYear: "2025",
    role: "solo project, made a website for miyajlo, ui designer and a game developer",
    detailImages: "miyajlo", // Folder name to load images from
  },
  {
    title: "macOS file sorter",
    year: "2026",
    link: "https://github.com/m3Mza/file-sorter-mac",
    img: "/m.png",
    client: "miyajlo",
    clientYear: "2026",
    role: "solo project, made a simple c++ script for macOS that sorts the files in the downloads folder into smaller subfolders",
    detailImages: "filesorter",
  },
];

const menuSections = [
  {
    header: "[1.0] selected projects",
    items: [
      { title: "[1.0.1] miyajlo", img: "/miyajlo/miyajlo.mov" },
      { title: "[1.0.2] macOS file sorter", img: "/m.png" },
    ]
  },
  {
    header: "[2.0] download resume",
    items: []
  },
  {
    header: "[3.0] information",
    items: []
  }
];

function App() {
  const heroContainerRef = useRef<HTMLDivElement>(null);

  useImageTrailEffect({ containerRef: heroContainerRef });
  
  // Load project images dynamically
  const [projectImages, setProjectImages] = useState<string[]>([]);
  
  const [menuItems, setMenuItems] = useState(() => {
    const result: Array<{ header: string; items: any[]; id: number }> = [];
    const repeatCount = 20; // Infinite scrolling for all devices
    
    for (let i = 0; i < repeatCount; i++) {
      menuSections.forEach((section, idx) => {
        result.push({ ...section, id: i * menuSections.length + idx });
      });
    }
    return result;
  });

  const [hoverImg, setHoverImg] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<typeof baseProjects[0] | null>(null);
  const [showInformation, setShowInformation] = useState(false);
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

  const handleMenuScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    if (scrollHeight - scrollTop - clientHeight <= clientHeight * 0.5) {
      setMenuItems(prev => {
        const newItems = [...prev];
        const currentLength = newItems.length;
        menuSections.forEach((section, idx) => {
          newItems.push({
            ...section,
            id: currentLength + idx
          });
        });
        return newItems;
      });
    }
  };

  useEffect(() => {
    if (selectedProject?.img.endsWith('.mov') && detailVideoRef.current) {
      detailVideoRef.current.play().catch(() => {});
    }
    
    // Load images from the project folder when a project is selected
    if (selectedProject) {
      // Clear old images first
      setProjectImages([]);
      
      const detailImages = (selectedProject as any).detailImages;
      
      if (Array.isArray(detailImages)) {
        // Static array of images
        setProjectImages(detailImages);
      } else if (typeof detailImages === 'string') {
        // Folder name - load images dynamically
        const images = loadProjectImages(detailImages);
        setProjectImages(images);
      } else {
        // Fallback to empty array
        setProjectImages([]);
      }
    } else {
      // Clear images when no project is selected
      setProjectImages([]);
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
                      <p className="project-info-label">(1.0) job/project</p>
                      <p className="project-info-value">{selectedProject.title}</p>
                    </div>
                    <div className="project-info-item">
                      <p className="project-info-label">(2.0) what i did</p>
                      <p className="project-info-value">{selectedProject.role}</p>
                    </div>
                    <div className="project-info-item">
                      <p className="project-info-label">(3.0) year</p>
                      <p className="project-info-value">{selectedProject.year}</p>
                    </div>
                    <div className="project-info-item">
                      <p className="project-info-label">(4.0) link</p>
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
                  {/* Dynamically render images from folder */}
                  {projectImages.map((imagePath, index) => {
                    const isMobile = window.innerWidth <= 768;
                    const positions = [
                      { top: '300px', left: '10%' },
                      { top: '800px', left: '50%' },
                      { top: '1400px', left: '15%' }
                    ];
                    
                    // On mobile, show all images; on desktop, show first 3 with absolute positioning
                    const style = isMobile ? {} : (index < 3 ? positions[index] : { display: 'none' });
                    
                    const isVideo = imagePath.endsWith('.mov') || imagePath.endsWith('.mp4');
                    
                    return (
                      <div 
                        key={imagePath} 
                        className="project-image" 
                        style={style}
                      >
                        {isVideo ? (
                          <video
                            ref={index === 0 ? detailVideoRef : undefined}
                            src={imagePath}
                            muted
                            loop
                            autoPlay
                            playsInline
                          />
                        ) : (
                          <img src={imagePath} alt={`${selectedProject.title} ${index + 1}`} />
                        )}
                      </div>
                    );
                  })}
                  {/* Spacer to ensure scroll height on desktop */}
                  {window.innerWidth > 768 && <div style={{ height: '2000px' }}></div>}
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
              {showInformation ? (
                <p>i'm mirko, a developer who makes websites and apps, currently focusing on c++ and embedded programming, get in touch:</p>
              ) : (
                <>
                  <p>i make websites occasionally,</p>
                  <p>currently learning embedded engineering.</p>
                </>
              )}
            </div>
            {showInformation ? (
              <>
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
                  mail: mirkomimap@gmail.com
                </a>
                <a className="hero-grid-small-text" href="https://www.linkedin.com/in/mirko-popovi%C4%87-b058823bb/" target="_blank" rel="noopener noreferrer" style={{ marginTop: '0.5rem' }}>
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
                  linkedin
                </a>
              </>
            ) : (
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
                mail: mirkomimap@gmail.com
              </a>
            )}
          </div>
          <div className="projects-right-side">
            <LenisScrollContainer
              ref={scrollContainerRef}
              className="projects-scroll-container"
              onScroll={handleMenuScroll}
            >
              <div className="menu-list">
                {menuItems.map((section) => (
                  <div key={section.id} className="menu-section">
                    {section.header.toLowerCase().includes('resume') ? (
                      <a 
                        href="/mirko-popovic-resume.pdf" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="menu-header menu-header-link"
                      >
                        {section.header}
                        <img 
                          src="/download-simple.svg" 
                          alt="download" 
                          className="download-icon"
                        />
                      </a>
                    ) : section.header.toLowerCase().includes('information') ? (
                      window.innerWidth <= 768 ? (
                        <a 
                          href="mailto:mirkomimap@gmail.com"
                          className="menu-header menu-header-link"
                        >
                          {section.header}
                        </a>
                      ) : (
                        <div 
                          className="menu-header menu-header-link"
                          onClick={() => setShowInformation(!showInformation)}
                          style={{ cursor: 'pointer' }}
                        >
                          {section.header}
                        </div>
                      )
                    ) : (
                      <div className="menu-header">{section.header}</div>
                    )}
                    {section.items.map((item, idx) => (
                      <div key={`${section.id}-${idx}`} className="menu-item">
                        <a
                          href="#"
                          className="menu-link"
                          onMouseEnter={() => handleWorkHover(item.img)}
                          onMouseLeave={handleWorkLeave}
                          onClick={(e) => {
                            e.preventDefault();
                            const isMobile = window.innerWidth <= 768;
                            const projectName = item.title.toLowerCase().replace(/\[[\d.]+\]\s*/, '');
                            const baseProject = baseProjects.find(p => p.title.toLowerCase().includes(projectName));
                            
                            if (baseProject) {
                              if (isMobile && baseProject.link) {
                                // On mobile, open the link directly
                                window.open(baseProject.link, '_blank', 'noopener,noreferrer');
                              } else {
                                // On desktop, show project details
                                setSelectedProject(baseProject);
                              }
                            }
                          }}
                        >
                          {item.title}
                        </a>
                      </div>
                    ))}
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
