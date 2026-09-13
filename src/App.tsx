import { useRef } from "react";
import { Link } from "react-router-dom";
import "./App.css";
import useImageTrailEffect from "./hooks/useImageTrailEffect";
import { useLenis } from "./hooks/useLenis";
import 'lenis/dist/lenis.css';

const projects: { title: string; type: string; date: string; link?: string }[] = [
  {
    title: "graduation thesis",
    type: "project",
    date: "21/6/2026",
    link: "/replication",
  },
  {
    title: "IWS internship @JTI",
    type: "job",
    date: "10/6/2026 -",
  },
];

const EMPTY_ROWS = 12;

function App() {
  const pageRef = useRef<HTMLDivElement>(null);

  useLenis();
  useImageTrailEffect({ containerRef: pageRef as React.RefObject<HTMLElement> });

  return (
    <div ref={pageRef} className="page">
      <span className="site-name">mirko</span>

      <div className="spacer" />

      <div className="projects-list">
        {projects.map((p, i) => (
          <div key={i} className="project-row">
            {p.link ? (
              <Link to={p.link} className="project-title">{p.title}</Link>
            ) : (
              <span className="project-title no-link">{p.title}</span>
            )}
            <span className="project-meta">{p.type}, {p.date}</span>
          </div>
        ))}
        {Array.from({ length: EMPTY_ROWS }).map((_, i) => (
          <div key={`empty-${i}`} className="project-row empty" />
        ))}
      </div>

      <footer className="site-footer">
        <a href="mailto:mirkomimap@gmail.com">send me mail.</a>
      </footer>
    </div>
  );
}

export default App;
