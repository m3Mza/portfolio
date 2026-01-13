import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function useSelectedWorksParallax() {
  useEffect(() => {
    const initDelay = 300;

    const timeoutId = setTimeout(() => {
      const selectedWorksSection = document.querySelector(".selected-works-section");
      const bigImageFigures = document.querySelectorAll(".selected-works-big-image");

      if (!selectedWorksSection || bigImageFigures.length === 0) return;

      bigImageFigures.forEach((figure) => {
        gsap.fromTo(figure, 
          {
            y: 0,
          },
          {
            y: -100,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              trigger: selectedWorksSection,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === selectedWorksSection) {
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

export default useSelectedWorksParallax;
