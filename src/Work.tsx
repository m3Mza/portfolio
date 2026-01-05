import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const items = [
  {
    title: "Chromatic Loopscape",
    description:
      "An immersive exploration of color transitions and infinite patterns through generative art.",
    link: "https://example.com/chromatic-loopscape",
  },
  {
    title: "Solar Bloom",
    description:
      "Interactive visualization inspired by solar phenomena and organic growth patterns.",
    link: "https://example.com/solar-bloom",
  },
  {
    title: "Neon Handscape",
    description:
      "Digital art installation combining hand-drawn aesthetics with vibrant neon lighting.",
    link: "https://example.com/neon-handscape",
  },
  {
    title: "Echo Discs",
    description:
      "Sound-reactive visual experience featuring circular geometries and audio synthesis.",
    link: "https://example.com/echo-discs",
  },
  {
    title: "Void Gaze",
    description:
      "Contemplative piece exploring depth perception and negative space in digital environments.",
    link: "https://example.com/void-gaze",
  },
  {
    title: "Gravity Sync",
    description:
      "Physics-based animation showcasing gravitational forces and orbital mechanics.",
    link: "https://example.com/gravity-sync",
  },
  {
    title: "Heat Core",
    description:
      "Thermal-inspired generative artwork with dynamic temperature gradients.",
    link: "https://example.com/heat-core",
  },
  {
    title: "Fractal Mirage",
    description:
      "Self-similar patterns creating hypnotic visual illusions through recursive algorithms.",
    link: "https://example.com/fractal-mirage",
  },
  {
    title: "Nova Pulse",
    description:
      "Explosive energy patterns mimicking stellar phenomena and cosmic events.",
    link: "https://example.com/nova-pulse",
  },
  {
    title: "Sonic Horizon",
    description:
      "Audio-visual experience blending soundscapes with horizon-based compositions.",
    link: "https://example.com/sonic-horizon",
  },
  {
    title: "Dream Circuit",
    description:
      "Surreal digital landscape exploring the intersection of technology and imagination.",
    link: "https://example.com/dream-circuit",
  },
  {
    title: "Lunar Mesh",
    description:
      "3D wireframe exploration inspired by lunar topography and grid-based aesthetics.",
    link: "https://example.com/lunar-mesh",
  },
  {
    title: "Radiant Dusk",
    description:
      "Gradient-based composition capturing the ethereal beauty of twilight hours.",
    link: "https://example.com/radiant-dusk",
  },
  {
    title: "Pixel Drift",
    description:
      "Retro-inspired animation featuring pixel art and procedural movement patterns.",
    link: "https://example.com/pixel-drift",
  },
  {
    title: "Vortex Bloom",
    description:
      "Spiraling organic forms combining natural growth with mathematical precision.",
    link: "https://example.com/vortex-bloom",
  },
  {
    title: "Shadow Static",
    description:
      "Glitch art exploration using shadow manipulation and digital noise artifacts.",
    link: "https://example.com/shadow-static",
  },
  {
    title: "Crimson Phase",
    description:
      "Monochromatic red-toned experience exploring phase shifts and transitions.",
    link: "https://example.com/crimson-phase",
  },
  {
    title: "Retro Cascade",
    description:
      "Nostalgic journey through vintage computing aesthetics and cascading animations.",
    link: "https://example.com/retro-cascade",
  },
  {
    title: "Photon Fold",
    description:
      "Light-based installation examining the behavior of photons and optical phenomena.",
    link: "https://example.com/photon-fold",
  },
  {
    title: "Zenith Flow",
    description:
      "Meditative visual flow exploring peak moments and continuous movement.",
    link: "https://example.com/zenith-flow",
  },
];

function Work() {
  const [isMenuActive, setIsMenuActive] = useState(false); // Changed
  const [isPageTransition, setIsPageTransition] = useState(() => {
    return sessionStorage.getItem("pageTransition") === "true";
  });
  const [isReturning, setIsReturning] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  /* =======================
==========================
PAGE TRANSITION LOGIC
==========================
========================== */

  useEffect(() => {
    const isTransitioning = sessionStorage.getItem("pageTransition");
    if (isTransitioning === "true") {
      sessionStorage.removeItem("pageTransition");

      // Hold at full screen for a short delay (already at full screen from initial state)
      setTimeout(() => {
        // Return to original shape
        setIsPageTransition(false);
        setIsReturning(true);

        // Short delay after returning to original shape
        setTimeout(() => {
          // Close menu (return to button)
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

    // Check if clicking the same page - just refresh
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
          sessionStorage.removeItem("pageTransition");
        } else if (href.startsWith("#")) {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
          sessionStorage.removeItem("pageTransition");
          setIsPageTransition(false);
          setIsMenuActive(false);
        } else if (isInternal) {
          setIsMenuActive(false); // Close menu right before navigation
          navigate(href);
          return;
        } else {
          window.location.href = href;
        }
      }, 800);
    } else {
      setIsMenuActive(false);
      if (href.startsWith("http")) {
        window.open(href, "_blank");
      } else if (href.startsWith("#")) {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else if (isInternal) {
        navigate(href);
        return;
      } else {
        window.location.href = href;
      }
    }
  };

  /* =======================
==========================
GALLERY STUFF AND INTERACTIONS
==========================
========================== */

  const canvasRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLParagraphElement>(null);

  const [canDrag, setCanDrag] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const currentXRef = useRef(0);
  const currentYRef = useRef(0);
  const dragVelocityXRef = useRef(0);
  const dragVelocityYRef = useRef(0);
  const mouseHasMovedRef = useRef(false);
  const visibleItemsRef = useRef(new Set<string>());
  const lastUpdateTimeRef = useRef(0);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const activeItemRef = useRef<HTMLElement | null>(null);
  const originalPositionRef = useRef<any>(null);
  const expandedItemRef = useRef<HTMLDivElement | null>(null);
  const activeItemIdRef = useRef<string | null>(null);
  const lastDragTimeRef = useRef(Date.now());
  const titleWordsRef = useRef<HTMLSpanElement[]>([]);
  const titleSplitRef = useRef<{
    words: HTMLSpanElement[];
    revert: () => void;
  } | null>(null);
  const titleAnimationRef = useRef<gsap.core.Tween | null>(null);
  const descAnimationRef = useRef<gsap.core.Tween | null>(null);
  const linkAnimationRef = useRef<gsap.core.Tween | null>(null);
  const isExpandAnimationCompleteRef = useRef(false);

  const itemCount = 20;
  const itemGap = 150;
  const itemWidth = 140;
  const itemHeight = 180;

  // Gallery hover animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!canvas || !container || !overlay) return;

    const setAndAnimateTitle = (title: string) => {
      if (titleSplitRef.current) {
        titleSplitRef.current.revert();
      }
      if (projectTitleRef.current) {
        projectTitleRef.current.textContent = title;

        // Split text into words
        const words = title.split(" ");
        projectTitleRef.current.innerHTML = "";
        titleWordsRef.current = [];

        words.forEach((word) => {
          const span = document.createElement("span");
          span.className = "word";
          span.textContent = word;
          span.style.display = "inline-block";
          span.style.marginRight = "0.3em";
          projectTitleRef.current?.appendChild(span);
          titleWordsRef.current.push(span);
        });

        titleSplitRef.current = {
          words: titleWordsRef.current,
          revert: () => {
            if (projectTitleRef.current) {
              projectTitleRef.current.innerHTML = "";
            }
            titleWordsRef.current = [];
          },
        };

        gsap.set(titleWordsRef.current, { y: "150%" });
      }
    };

    const setProjectInfo = (description: string, link: string) => {
      const descElement = document.querySelector(".project-description");
      const linkElement = document.querySelector(
        ".project-link"
      ) as HTMLAnchorElement;

      if (descElement) {
        descElement.textContent = description;
        gsap.set(descElement, { opacity: 0, y: 20 });
      }

      if (linkElement) {
        linkElement.href = link;
        gsap.set(linkElement, { opacity: 0, y: 20 });
      }
    };

    const animateProjectInfoOut = () => {
      const descElement = document.querySelector(".project-description");
      const linkElement = document.querySelector(".project-link");

      gsap.to([descElement, linkElement], {
        opacity: 0,
        y: 20,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const animateTitleIn = () => {
      gsap.to(titleWordsRef.current, {
        y: "0%",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });
    };

    const animateTitleOut = () => {
      gsap.to(titleWordsRef.current, {
        y: "-150%",
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
      });
    };

    const updateVisibleItems = () => {
      const buffer = 2.5;
      const viewWidth = window.innerWidth * (1 + buffer);
      const viewHeight = window.innerHeight * (1 + buffer);
      const movingRight = targetXRef.current > currentXRef.current;
      const movingDown = targetYRef.current > currentYRef.current;
      const directionBufferX = movingRight ? -300 : 300;
      const directionBufferY = movingDown ? -300 : 300;

      const startCol = Math.floor(
        (-currentXRef.current -
          viewWidth / 2 +
          (movingRight ? directionBufferX : 0)) /
          (itemWidth + itemGap)
      );
      const endCol = Math.ceil(
        (-currentXRef.current +
          viewWidth * 1.5 +
          (!movingRight ? directionBufferX : 0)) /
          (itemWidth + itemGap)
      );
      const startRow = Math.floor(
        (-currentYRef.current -
          viewHeight / 2 +
          (movingDown ? directionBufferY : 0)) /
          (itemHeight + itemGap)
      );
      const endRow = Math.ceil(
        (-currentYRef.current +
          viewHeight * 1.5 +
          (!movingDown ? directionBufferY : 0)) /
          (itemHeight + itemGap)
      );

      const currentItems = new Set<string>();

      for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
          const itemId = `${col},${row}`;
          currentItems.add(itemId);

          if (visibleItemsRef.current.has(itemId)) continue;
          if (activeItemIdRef.current === itemId && isExpanded) continue;

          const item = document.createElement("div");
          item.className = "item";
          item.id = itemId;
          item.style.left = `${col * (itemWidth + itemGap)}px`;
          item.style.top = `${row * (itemHeight + itemGap)}px`;

          const img = document.createElement("img");
          const imgNum = ((Math.abs(col) + Math.abs(row)) % itemCount) + 1;
          img.src = `/img${imgNum}.jpg`;
          img.alt = `Gallery item ${imgNum}`;
          img.draggable = false;
          img.ondragstart = () => false;
          item.appendChild(img);

          item.addEventListener("click", () => {
            if (!mouseHasMovedRef.current && !isExpanded) {
              expandItem(item);
            }
          });

          canvas.appendChild(item);
          visibleItemsRef.current.add(itemId);
        }
      }

      visibleItemsRef.current.forEach((itemId) => {
        if (
          !currentItems.has(itemId) ||
          (activeItemIdRef.current === itemId && isExpanded)
        ) {
          const item = document.getElementById(itemId);
          if (item) {
            canvas.removeChild(item);
            visibleItemsRef.current.delete(itemId);
          }
        }
      });
    };

    const expandItem = (item: HTMLElement) => {
      setIsExpanded(true);
      isExpandAnimationCompleteRef.current = false;
      activeItemRef.current = item;
      activeItemIdRef.current = item.id;
      expandedItemRef.current = item as HTMLDivElement;
      setCanDrag(false);
      if (container) container.style.cursor = "auto";

      const imgSrc = item.querySelector("img")?.src || "";
      const imgMatch = imgSrc.match(/img(\d+)\.jpg$/);
      const imgNum = imgMatch ? parseInt(imgMatch[1]) : 1;
      const projectIndex = (imgNum - 1) % items.length;
      const project = items[projectIndex];

      setAndAnimateTitle(project.title);
      setProjectInfo(project.description, project.link);

      item.style.visibility = "hidden";

      const rect = item.getBoundingClientRect();

      originalPositionRef.current = {
        id: item.id,
        rect: rect,
        imgSrc: imgSrc,
      };

      overlay.classList.add("active");

      const expandedItem = document.createElement("div");
      expandedItem.className = "expanded-item";
      expandedItem.style.width = `${itemWidth}px`;
      expandedItem.style.height = `${itemHeight}px`;

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "Expanded Image";
      expandedItem.appendChild(img);
      expandedItem.addEventListener("click", closeExpandedItem);
      document.body.appendChild(expandedItem);
      expandedItemRef.current = expandedItem;

      document.querySelectorAll(".item").forEach((el) => {
        if (el !== item) {
          gsap.to(el, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });

      const viewportWidth = window.innerWidth;
      const targetWidth = viewportWidth * 0.4;
      const targetHeight = targetWidth * 1.2;

      titleAnimationRef.current = gsap.delayedCall(0.7, animateTitleIn);
      descAnimationRef.current = gsap.delayedCall(0.8, () => {
        const descElement = document.querySelector(".project-description");
        const linkElement = document.querySelector(".project-link");

        gsap.to(descElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        });

        linkAnimationRef.current = gsap.to(linkElement, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        });
      });

      gsap.fromTo(
        expandedItem,
        {
          width: itemWidth,
          height: itemHeight,
          x: rect.left + itemWidth / 2 - window.innerWidth / 2,
          y: rect.top + itemHeight / 2 - window.innerHeight / 2,
        },
        {
          width: targetWidth,
          height: targetHeight,
          x: 0,
          y: 0,
          duration: 1,
          ease: "hop",
          onComplete: () => {
            isExpandAnimationCompleteRef.current = true;
          },
        }
      );
    };

    const closeExpandedItem = () => {
      if (
        !expandedItemRef.current ||
        !originalPositionRef.current ||
        !isExpandAnimationCompleteRef.current
      )
        return;

      // Kill any pending animations
      if (titleAnimationRef.current) {
        titleAnimationRef.current.kill();
        titleAnimationRef.current = null;
      }
      if (descAnimationRef.current) {
        descAnimationRef.current.kill();
        descAnimationRef.current = null;
      }
      if (linkAnimationRef.current) {
        linkAnimationRef.current.kill();
        linkAnimationRef.current = null;
      }

      animateTitleOut();
      animateProjectInfoOut();

      // Clear title text after animation
      setTimeout(() => {
        if (projectTitleRef.current) {
          projectTitleRef.current.innerHTML = "";
        }
      }, 450);

      overlay.classList.remove("active");
      const originalRect = originalPositionRef.current.rect;

      document.querySelectorAll(".item").forEach((el) => {
        if (el.id !== activeItemIdRef.current) {
          gsap.to(el, {
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        }
      });

      const originalItem = document.getElementById(
        activeItemIdRef.current || ""
      );

      gsap.to(expandedItemRef.current, {
        width: itemWidth,
        height: itemHeight,
        x: originalRect.left + itemWidth / 2 - window.innerWidth / 2,
        y: originalRect.top + itemHeight / 2 - window.innerHeight / 2,
        duration: 1,
        ease: "hop",
        onComplete: () => {
          if (expandedItemRef.current && expandedItemRef.current.parentNode) {
            expandedItemRef.current.parentNode.removeChild(
              expandedItemRef.current
            );
          }

          if (originalItem) {
            originalItem.style.visibility = "visible";
          }

          expandedItemRef.current = null;
          setIsExpanded(false);
          activeItemRef.current = null;
          originalPositionRef.current = null;
          activeItemIdRef.current = null;
          setCanDrag(true);
          if (container) container.style.cursor = "grab";
          dragVelocityXRef.current = 0;
          dragVelocityYRef.current = 0;
        },
      });
    };

    const animate = () => {
      if (canDrag) {
        const ease = 0.075;
        currentXRef.current +=
          (targetXRef.current - currentXRef.current) * ease;
        currentYRef.current +=
          (targetYRef.current - currentYRef.current) * ease;

        canvas.style.transform = `translate(${currentXRef.current}px, ${currentYRef.current}px)`;

        const now = Date.now();
        const distMoved = Math.sqrt(
          Math.pow(currentXRef.current - lastXRef.current, 2) +
            Math.pow(currentYRef.current - lastYRef.current, 2)
        );

        if (distMoved > 100 || now - lastUpdateTimeRef.current > 100) {
          updateVisibleItems();
          lastXRef.current = currentXRef.current;
          lastYRef.current = currentYRef.current;
          lastUpdateTimeRef.current = now;
        }
      }

      requestAnimationFrame(animate);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!canDrag) return;
      isDraggingRef.current = true;
      mouseHasMovedRef.current = false;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      container.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !canDrag) return;

      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseHasMovedRef.current = true;
      }

      const now = Date.now();
      const dt = Math.max(10, now - lastDragTimeRef.current);
      lastDragTimeRef.current = now;

      dragVelocityXRef.current = dx / dt;
      dragVelocityYRef.current = dy / dt;

      targetXRef.current += dx;
      targetYRef.current += dy;

      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
    };

    const handleMouseUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      if (canDrag) {
        container.style.cursor = "grab";
      }

      if (
        Math.abs(dragVelocityXRef.current) > 0.1 ||
        Math.abs(dragVelocityYRef.current) > 0.1
      ) {
        const momentumFactor = 200;
        targetXRef.current += dragVelocityXRef.current * momentumFactor;
        targetYRef.current += dragVelocityYRef.current * momentumFactor;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!canDrag) return;
      isDraggingRef.current = true;
      mouseHasMovedRef.current = false;
      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || !canDrag) return;

      const dx = e.touches[0].clientX - startXRef.current;
      const dy = e.touches[0].clientY - startYRef.current;

      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        mouseHasMovedRef.current = true;
      }

      targetXRef.current += dx;
      targetYRef.current += dy;

      startXRef.current = e.touches[0].clientX;
      startYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    const handleOverlayClick = () => {
      if (isExpanded) closeExpandedItem();
    };

    const handleResize = () => {
      if (isExpanded && expandedItemRef.current) {
        const viewportWidth = window.innerWidth;
        const targetWidth = viewportWidth * 0.4;
        const targetHeight = targetWidth * 1.2;

        gsap.to(expandedItemRef.current, {
          width: targetWidth,
          height: targetHeight,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        updateVisibleItems();
      }
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    overlay.addEventListener("click", handleOverlayClick);
    window.addEventListener("resize", handleResize);

    updateVisibleItems();
    animate();

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      overlay.removeEventListener("click", handleOverlayClick);
      window.removeEventListener("resize", handleResize);
    };
  }, [canDrag, isExpanded]);

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
            {isMenuActive ? "CLOSE" : "MENU"}
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
          <a href="/about" onClick={(e) => handleLinkClick(e, "/about")}>
            about
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

      {/* Gallery */}
      <div className="work-container" ref={containerRef}>
        <div className="work-canvas" ref={canvasRef}></div>
        <div className="work-overlay" ref={overlayRef}></div>
      </div>

      {/* Project Title */}
      <div className="project-title">
        <p ref={projectTitleRef}></p>
      </div>

      {/* Project Info */}
      <div className="project-info">
        <p className="project-description"></p>
        <a
          className="project-link"
          href="#"
          target="_blank"
          rel="noopener noreferrer"
        >
          VISIT
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              marginLeft: "6px",
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
    </>
  );
}

export default Work;
