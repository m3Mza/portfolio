import { useState, useEffect } from "react";
import "./App.css";
import InfiniteWorkList from "./components/InfiniteWorkList";

const items = [
  { title: "z", image: "/img1.jpeg", variant: 1, url: "https://example.com/project-z" },
  { title: "LoveFrom,", image: "/img2.jpeg", variant: 2, url: "https://example.com/lovefrom" },
  { title: "ヨコオタロウさん", image: "/img3.jpeg", variant: 3, url: "https://example.com/yoko-taro" },
  { title: "JOHN YAKUZA", image: "/img4.jpeg", variant: 1, url: "https://example.com/john-yakuza" },
  { title: "red hot chilli peppers", image: "/img5.jpeg", variant: 2, url: "https://example.com/red-hot" },
  { title: "naughty cat", image: "/img6.jpeg", variant: 3, url: "https://example.com/naughty-cat" },
  { title: "design 2000", image: "/img7.jpeg", variant: 1, url: "https://example.com/design-2000" },
  { title: "hello_world", image: "/img8.jpeg", variant: 2, url: "https://example.com/hello-world" },
  { title: "idk", image: "/img9.jpeg", variant: 3, url: "https://example.com/idk" },
];

function Work() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentVariant, setCurrentVariant] = useState<number>(1);
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  
  useEffect(() => {
    const isTransitioning = sessionStorage.getItem("pageTransition");
    if (isTransitioning === "true") {
      sessionStorage.removeItem("pageTransition");
      setTimeout(() => {
        setIsReturning(true);
        setTimeout(() => {
          setIsPageTransition(false);
          setIsReturning(false);
        }, 700);
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
          setTimeout(() => {
            setIsPageTransition(false);
            sessionStorage.removeItem("pageTransition");
          }, 100);
        } else if (href.startsWith("#")) {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
          setIsPageTransition(false);
          sessionStorage.removeItem("pageTransition");
        } else if (isInternal) {
          window.location.href = href;
        } else {
          window.location.href = href;
        }
      }, 800);
    } else {
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else if (href.startsWith("#")) {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else if (isInternal) {
        window.location.href = href;
      } else {
        window.location.href = href;
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const handleItemHover = (image: string, variant: number) => {
    setCurrentImage(image);
    setCurrentVariant(variant);
  };

  const handleItemLeave = () => {
    setCurrentImage("");
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

      {/* Static Header */}
      <div className="blog-header-sticky">
        <h1>
          WORK
        </h1>
      </div>

      <InfiniteWorkList
        items={items}
        onItemHover={handleItemHover}
        onItemLeave={handleItemLeave}
        currentImage={currentImage}
        currentVariant={currentVariant}
      />
    </>
  );
}

export default Work;
