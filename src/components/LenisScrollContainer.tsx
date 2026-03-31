import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis';

interface LenisScrollContainerProps {
  children: ReactNode;
  className?: string;
  onScroll?: (scroll: number) => void;
}

export interface LenisScrollRef {
  scrollTo: (target: number | string | HTMLElement, options?: any) => void;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

const LenisScrollContainer = forwardRef<LenisScrollRef, LenisScrollContainerProps>(
  ({ children, className = '', onScroll }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lenisRef = useRef<Lenis | null>(null);

    useImperativeHandle(ref, () => ({
      scrollTo: (target, options) => lenisRef.current?.scrollTo(target, options),
      get scrollTop() {
        return lenisRef.current?.scroll || 0;
      },
      get scrollHeight() {
        return containerRef.current?.scrollHeight || 0;
      },
      get clientHeight() {
        return containerRef.current?.clientHeight || 0;
      },
    }));

    useEffect(() => {
      if (!containerRef.current) return;

      const lenis = new Lenis({
        wrapper: containerRef.current,
        content: containerRef.current.firstElementChild as HTMLElement,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      if (onScroll) {
        lenis.on('scroll', ({ scroll }) => {
          onScroll(scroll);
        });
      }

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);

      return () => {
        lenis.destroy();
      };
    }, [onScroll]);

    return (
      <div ref={containerRef} className={className} style={{ overflow: 'hidden', height: '100%' }}>
        <div>{children}</div>
      </div>
    );
  }
);

LenisScrollContainer.displayName = 'LenisScrollContainer';

export default LenisScrollContainer;
