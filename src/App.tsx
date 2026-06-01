import { useRef } from "react";
import "./App.css";
import "./responsive.css";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import { useLenis } from "./hooks/useLenis";
import 'lenis/dist/lenis.css';
import FilmProjectsList from "./components/FilmProjectsList";
import type { FilmProject } from "./components/FilmProjectsList";

const baseProjects: FilmProject[] = [
  {
    title: "File-sorting tool for MacOS",
    subtitle: "C++ utility · 2026",
    description: "A command-line tool that monitors your Downloads folder and automatically organizes files into typed subdirectories.",
    link: "https://github.com/m3Mza/file-sorter-mac",
    linkLabel: "GitHub link",
    img: "/GitHub_Invertocat_Black_Clearspace.svg",
    heroImg: "/GitHub_Invertocat_Black_Clearspace.svg",
    xOffset: "2rem",
  },
  {
    title: "Website replication with Claude Code",
    subtitle: "Graduation thesis · 2026",
    description: "Graduation thesis project exploring the use of Claude Code for accurate website replication.",
    link: "/replication",
    linkLabel: "Check out the project",
    img: "/m.png",
    heroImg: "/diplomski/claude4.png",
    xOffset: "8rem",
  },
];

function App() {
  const heroContainerRef = useRef<HTMLElement>(null);

  useLenis();
  useImageTrailEffect({ containerRef: heroContainerRef });

  return (
    <div>
      <section ref={heroContainerRef} className="hero-grid-section">
        <div className="hero-split-container">
          <span className="hero-simplicity-label">mirko</span>

          <div className="hero-left-side">
            <div className="hero-grid-description">
              <p>I develop things I find interesting or helpful,</p>
              <p>scroll down for more.</p>
            </div>
            <a className="hero-grid-small-text" href="mailto:mirkomimap@gmail.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/arrow-elbow-down-right.svg"
                alt="arrow"
                style={{ width: '0.9rem', height: '0.9rem', marginRight: '4px', marginBottom: '2px', display: 'inline-block', verticalAlign: 'middle', filter: 'invert(1)' }}
              />
              contact: mirkomimap@gmail.com
            </a>
          </div>
        </div>
      </section>

      <FilmProjectsList projects={baseProjects} />
    </div>
  );
}

export default App;
