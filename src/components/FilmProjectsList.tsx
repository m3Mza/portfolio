import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './FilmProjectsList.css';

export interface FilmProject {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  linkLabel: string;
  img: string;
  heroImg?: string;
  xOffset: string;
}

interface Props {
  projects: FilmProject[];
}

const ITEM_VH = 35;

export default function FilmProjectsList({ projects }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handle = () => {
      if (!sectionRef.current) return;
      const ST = sectionRef.current.getBoundingClientRect().top + window.scrollY;
      const itemH = ITEM_VH / 100 * window.innerHeight;
      const idx = Math.max(0, Math.min(projects.length - 1, Math.round((window.scrollY - ST) / itemH)));
      setActiveIndex(p => p !== idx ? idx : p);
    };
    window.addEventListener('scroll', handle, { passive: true });
    handle();
    return () => window.removeEventListener('scroll', handle);
  }, [projects.length]);

  const active = projects[activeIndex];
  const sectionH = `calc(100vh + ${projects.length * ITEM_VH}vh)`;

  return (
    <section ref={sectionRef} className="fpl-section" style={{ minHeight: sectionH }}>

      {/* ── LEFT ── */}
      <div className="fpl-left" style={{ height: sectionH }}>

        {/* Thumbnails first — overlay (later in DOM) paints on top without needing z-index */}
        {projects.map((p, i) => (
          <img
            key={i}
            src={p.img}
            alt=""
            className="fpl-thumb"
            style={{
              position: 'absolute',
              top: `calc(50vh + ${i * ITEM_VH}vh)`,
              left: p.xOffset,
              opacity: i < activeIndex ? 0.3 : 1,
            }}
          />
        ))}

        {/* Sticky center overlay — stays in view for the full section height */}
        <div className="fpl-overlay">
          <div className="fpl-above">
            <p className="fpl-name">{active.title}</p>
          </div>
          <div className="fpl-line" />
          <div className="fpl-below">
            {active.link.startsWith('http') ? (
              <a className="fpl-link" href={active.link} target="_blank" rel="noopener noreferrer">
                <img src="/arrow-elbow-down-right.svg" alt="" className="fpl-link-arrow" />
                {active.linkLabel}
              </a>
            ) : (
              <Link className="fpl-link" to={active.link}>
                <img src="/arrow-elbow-down-right.svg" alt="" className="fpl-link-arrow" />
                {active.linkLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="fpl-right">
        <div className="fpl-right-inner">
          <p className="fpl-desc">{active.description}</p>
          <div className="fpl-hero-wrap">
            <img src={active.heroImg ?? active.img} alt={active.title} className="fpl-hero" />
          </div>
        </div>
      </div>

    </section>
  );
}
