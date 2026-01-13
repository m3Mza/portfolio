import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function useParallaxGallery() {
  useEffect(() => {
    const initDelay = 300;

    const timeoutId = setTimeout(() => {
      const parallaxSection = document.querySelector(".parallax-gallery");
      const textElement = document.querySelector(".parallax-gallery-text h3");
      const imageElement = document.querySelector(
        ".parallax-gallery-image img"
      ) as HTMLImageElement;

      if (!parallaxSection || !textElement || !imageElement)
        return;

      imageElement.crossOrigin = "anonymous";

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const getLuminance = (r: number, g: number, b: number): number => {
        const [rs, gs, bs] = [r, g, b].map(c => {
          c = c / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
      };

      const getContrastColor = (luminance: number, alpha: number = 0.9): string => {
        if (luminance < 0.5) {
          return `rgba(255, 255, 255, ${alpha})`;
        } else {
          return `rgba(0, 0, 0, ${alpha})`;
        }
      };

      const sampleImageRegion = (
        imgElement: HTMLImageElement,
        regionRect: { x: number; y: number; width: number; height: number }
      ): { luminance: number; color: string } => {
        try {
          const sampleWidth = Math.min(Math.ceil(regionRect.width), 200);
          const sampleHeight = Math.min(Math.ceil(regionRect.height), 200);
          
          if (sampleWidth <= 0 || sampleHeight <= 0) {
            return { luminance: 0.5, color: 'rgba(255, 255, 255, 0.85)' };
          }

          canvas.width = sampleWidth;
          canvas.height = sampleHeight;

          const imgRect = imgElement.getBoundingClientRect();
          const scaleX = imgElement.naturalWidth / imgRect.width;
          const scaleY = imgElement.naturalHeight / imgRect.height;

          const sourceX = Math.max(0, (regionRect.x - imgRect.left) * scaleX);
          const sourceY = Math.max(0, (regionRect.y - imgRect.top) * scaleY);
          const sourceWidth = Math.min(regionRect.width * scaleX, imgElement.naturalWidth - sourceX);
          const sourceHeight = Math.min(regionRect.height * scaleY, imgElement.naturalHeight - sourceY);

          if (sourceWidth <= 0 || sourceHeight <= 0) {
            return { luminance: 0.5, color: 'rgba(255, 255, 255, 0.85)' };
          }

          ctx.drawImage(
            imgElement,
            sourceX, sourceY, sourceWidth, sourceHeight,
            0, 0, sampleWidth, sampleHeight
          );

          const imageData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
          const pixels = imageData.data;

          let totalR = 0, totalG = 0, totalB = 0;
          let pixelCount = 0;

          for (let i = 0; i < pixels.length; i += 16) {
            totalR += pixels[i];
            totalG += pixels[i + 1];
            totalB += pixels[i + 2];
            pixelCount++;
          }

          if (pixelCount === 0) {
            return { luminance: 0.5, color: 'rgba(255, 255, 255, 0.85)' };
          }

          const avgR = totalR / pixelCount;
          const avgG = totalG / pixelCount;
          const avgB = totalB / pixelCount;

          const luminance = getLuminance(avgR, avgG, avgB);
          const contrastColor = getContrastColor(luminance, 0.85);

          return { luminance, color: contrastColor };
        } catch (error) {
          console.error('Canvas sampling error:', error);
          return { luminance: 0.5, color: 'rgba(255, 255, 255, 0.85)' };
        }
      };

      const setupScrollTrigger = () => {
        gsap.to(imageElement, {
          y: -150,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: parallaxSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.5,
          },
        });

        let lastUpdateTime = 0;
        const throttleMs = 32;
        let rafId: number | null = null;
        let cachedTextRect: DOMRect | null = null;
        let cachedImageRect: DOMRect | null = null;

        const updateRects = () => {
          cachedTextRect = textElement.getBoundingClientRect();
          cachedImageRect = imageElement.getBoundingClientRect();
        };

        ScrollTrigger.create({
          trigger: parallaxSection,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: () => {
            const now = performance.now();
            if (now - lastUpdateTime < throttleMs) return;
            lastUpdateTime = now;

            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
              updateRects();
              
              if (!cachedTextRect || !cachedImageRect) return;
              
              const textRect = cachedTextRect;
              const imageRect = cachedImageRect;

              const isOverlapping = !(
                textRect.right < imageRect.left ||
                textRect.left > imageRect.right ||
                textRect.bottom < imageRect.top ||
                textRect.top > imageRect.bottom
              );

              if (isOverlapping) {
                const overlapTop = Math.max(textRect.top, imageRect.top);
                const overlapBottom = Math.min(textRect.bottom, imageRect.bottom);
                const overlapLeft = Math.max(textRect.left, imageRect.left);
                const overlapRight = Math.min(textRect.right, imageRect.right);

                const overlapRegion = {
                  x: overlapLeft,
                  y: overlapTop,
                  width: overlapRight - overlapLeft,
                  height: overlapBottom - overlapTop
                };

                const { color: OVERLAY_COLOR } = sampleImageRegion(imageElement, overlapRegion);

                const topPercent =
                  ((overlapTop - textRect.top) / textRect.height) * 100;
                const bottomPercent =
                  ((overlapBottom - textRect.top) / textRect.height) * 100;

                const leftPercent =
                  ((overlapLeft - textRect.left) / textRect.width) * 100;
                const rightPercent =
                  ((overlapRight - textRect.left) / textRect.width) * 100;

                const gradient = `linear-gradient(to bottom, var(--black) 0%, var(--black) ${topPercent}%, ${OVERLAY_COLOR} ${topPercent}%, ${OVERLAY_COLOR} ${bottomPercent}%, var(--black) ${bottomPercent}%, var(--black) 100%), linear-gradient(to right, var(--black) 0%, var(--black) ${leftPercent}%, ${OVERLAY_COLOR} ${leftPercent}%, ${OVERLAY_COLOR} ${rightPercent}%, var(--black) ${rightPercent}%, var(--black) 100%)`;

                gsap.set(textElement, {
                  backgroundImage: gradient,
                  backgroundClip: "text",
                  webkitBackgroundClip: "text",
                  webkitTextFillColor: "transparent",
                  backgroundBlendMode: "multiply",
                });
              } else {
                gsap.set(textElement, {
                  backgroundImage: "none",
                  backgroundClip: "unset",
                  webkitBackgroundClip: "unset",
                  webkitTextFillColor: "unset",
                  color: "var(--black)",
                });
              }
            });
          },
        });
      };

      const originalSrc = imageElement.src;
      imageElement.src = '';
      imageElement.src = originalSrc;

      const initWhenReady = () => {
        if (imageElement.complete && imageElement.naturalWidth > 0) {
          setupScrollTrigger();
        } else {
          imageElement.addEventListener('load', () => {
            setupScrollTrigger();
          }, { once: true });
        }
      };

      initWhenReady();

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === parallaxSection) {
            trigger.kill();
          }
        });
      };
    }, initDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);
}

export default useParallaxGallery;
