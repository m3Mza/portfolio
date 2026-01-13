import { useState, useEffect } from "react";
import Lenis from "lenis";

interface WorkItem {
  title: string;
  image: string;
  variant: number;
  url: string;
}

interface InfiniteWorkListProps {
  items: WorkItem[];
  onItemHover: (image: string, variant: number) => void;
  onItemLeave: () => void;
  currentImage: string;
  currentVariant: number;
}

function InfiniteWorkList({
  items,
  onItemHover,
  onItemLeave,
  currentImage,
  currentVariant,
}: InfiniteWorkListProps) {
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
  }, [items, displayItems.length]);

  return (
    <div className="work-list-container">
      <div className="work-list-scroll">
        {displayItems.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="work-header-link"
            onMouseEnter={() => onItemHover(item.image, item.variant)}
            onMouseLeave={onItemLeave}
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
  );
}

export default InfiniteWorkList;
