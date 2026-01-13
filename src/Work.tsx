import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Lenis from "lenis";
import "./App.css";

const items = [
  { title: "z", image: "/img1.jpg", variant: 1, url: "https://example.com/project-z" },
  { title: "LoveFrom,", image: "/img2.jpg", variant: 2, url: "https://example.com/lovefrom" },
  { title: "ヨコオタロウさん", image: "/img3.jpg", variant: 3, url: "https://example.com/yoko-taro" },
  { title: "JOHN YAKUZA", image: "/img4.jpg", variant: 1, url: "https://example.com/john-yakuza" },
  { title: "red hot chilli peppers", image: "/img5.jpg", variant: 2, url: "https://example.com/red-hot" },
  { title: "naughty cat", image: "/img6.jpg", variant: 3, url: "https://example.com/naughty-cat" },
  { title: "design 2000", image: "/img7.jpg", variant: 1, url: "https://example.com/design-2000" },
  { title: "hello_world", image: "/img8.jpg", variant: 2, url: "https://example.com/hello-world" },
  { title: "idk", image: "/img9.jpg", variant: 3, url: "https://example.com/idk" },
];

function Work() {
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [currentVariant, setCurrentVariant] = useState<number>(1);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

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
      setIsMenuActive(false);
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
          navigate(href);
        } else {
          window.location.href = href;
        }
      }, 800);
    } else {
      setIsMenuActive(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else if (href.startsWith("#")) {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else if (isInternal) {
        navigate(href);
      } else {
        window.location.href = href;
      }
    }
  };

  const handleItemHover = (image: string, variant: number) => {
    setCurrentImage(image);
    setCurrentVariant(variant);
  };

  const handleItemLeave = () => {
    setCurrentImage("");
  };

  // State for dynamically cloned items
  const [displayItems, setDisplayItems] = useState(() => {
    // Start with 70 copies for ultra smooth infinite scroll
    const copies = [];
    for (let i = 0; i < 70; i++) {
      copies.push(...items);
    }
    return copies;
  });

  useEffect(() => {
    const container = document.querySelector('.work-list-container') as HTMLElement;
    if (!container) return;

    // Initialize Lenis
    const lenis = new Lenis({
      wrapper: container,
      content: container.querySelector('.work-list-scroll') as HTMLElement,
      smoothWheel: true,
      duration: 2.0,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.3,
      touchMultiplier: 1.0,
      infinite: false,
    });

    // Limit scroll velocity more strictly
    let scrollVelocity = 0;
    const maxVelocity = 1700; // Maximum pixels per second (reduced even more)

    lenis.on('scroll', ({ velocity }: { velocity: number }) => {
      scrollVelocity = Math.abs(velocity);
      
      // If velocity exceeds max, slow it down
      if (scrollVelocity > maxVelocity) {
        lenis.velocity = Math.sign(velocity) * maxVelocity;
      }
    });

    let isCloning = false;
    let lastCloneTime = 0;

    const handleScroll = () => {
      if (isCloning) return;
      
      const now = Date.now();
      // Throttle cloning operations to every 150ms minimum
      if (now - lastCloneTime < 150) return;

      const scrollTop = lenis.scroll || container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // When near the bottom (30000px buffer), add more items
      if (scrollTop + clientHeight >= scrollHeight - 30000) {
        isCloning = true;
        lastCloneTime = now;
        setDisplayItems(prev => {
          const newItems = [...prev];
          // Clone 20 copies at once
          for (let i = 0; i < 20; i++) {
            newItems.push(...items);
          }
          return newItems;
        });
        setTimeout(() => { isCloning = false; }, 100);
      }

      // When near the top (30000px buffer), prepend items and adjust scroll
      if (scrollTop <= 30000) {
        isCloning = true;
        lastCloneTime = now;
        const itemsHeight = (scrollHeight / displayItems.length) * items.length * 20;
        
        setDisplayItems(prev => {
          const newItems = [];
          // Clone 20 copies at once
          for (let i = 0; i < 20; i++) {
            newItems.push(...items);
          }
          newItems.push(...prev);
          return newItems;
        });
        
        // Adjust scroll position to maintain visual position with double RAF for smoothness
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const newPosition = container.scrollTop + itemsHeight;
            container.scrollTop = newPosition;
            lenis.scrollTo(newPosition, { immediate: true, force: true });
          });
        });
        setTimeout(() => { isCloning = false; }, 100);
      }

      // Trim items if too many (keep between 70-140 copies)
      if (displayItems.length > items.length * 140) {
        isCloning = true;
        lastCloneTime = now;
        const midPoint = Math.floor(displayItems.length / 2);
        const itemsToKeep = items.length * 105;
        const startIndex = midPoint - Math.floor(itemsToKeep / 2);
        
        setDisplayItems(prev => prev.slice(startIndex, startIndex + itemsToKeep));
        // Adjust scroll to middle with double RAF
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            container.scrollTop = container.scrollHeight / 2;
            lenis.scrollTo(container.scrollHeight / 2, { immediate: true, force: true });
          });
        });
        setTimeout(() => { isCloning = false; }, 100);
      }
    };

    lenis.on('scroll', handleScroll);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    // Set initial scroll position to middle
    setTimeout(() => {
      const initialPosition = container.scrollHeight / 2;
      container.scrollTop = initialPosition;
      lenis.scrollTo(initialPosition, { immediate: true });
    }, 100);

    return () => {
      lenis.destroy();
    };
  }, [displayItems.length]);

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
            {isMenuActive ? "close" : "menu"}
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
            home
          </a>
          <a href="/work" onClick={(e) => handleLinkClick(e, "/work")}>
            work
          </a>
          <a href="#contact" onClick={(e) => handleLinkClick(e, "#contact")}>
            contact
          </a>
        </div>
      </nav>

      {/* Static Header */}
      <div className="blog-header-sticky">
        <h1>
          work.
          <img
            src="/nier.gif"
            alt=""
            className="earth-gif"
            style={{
              display: "block",
              width: "2.7rem",
              height: "2.7rem",
              position: "absolute",
              left: "0.8rem",
              top: "0.3rem",
            }}
          />
        </h1>
      </div>

      {/* Work List Container */}
      <div className="work-list-container">
        <div className="work-list-scroll">
          {displayItems.map((item, index) => (
            <a
              key={index}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="work-header-link"
              onMouseEnter={() => handleItemHover(item.image, item.variant)}
              onMouseLeave={handleItemLeave}
            >
              {item.title}
            </a>
          ))}
        </div>
        
        {/* Image Display */}
        {currentImage && (
          <div className={`work-image-display variant-${currentVariant}`}>
            <img src={currentImage}/>
          </div>
        )}
      </div>
    </>
  );
}

export default Work;
