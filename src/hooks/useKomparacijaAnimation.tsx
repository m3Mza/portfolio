import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function useKomparacijaAnimation() {
  useEffect(() => {
    let animation: {
      scrollTrigger?: ScrollTrigger | null;
    } | null;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    
    const initAnimation = () => {
      gsap.registerPlugin(ScrollTrigger);

      const komparacijaFinalPosition = [
        [Math.random() * 200 - 100, Math.random() * 200 - 200],
        [Math.random() * 300 - 300, Math.random() * 100 - 50],
        [Math.random() * 100 - 50, Math.random() * 100 - 50],
        [Math.random() * 250 - 50, Math.random() * 150 - 75],
      ];

      const initialRotations = [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
      ];

      const komparacijaSlike = document.querySelectorAll(".komparacija-img");

      if (komparacijaSlike.length === 0) {
        console.warn("No images found for animation");
        return null;
      }

      komparacijaSlike.forEach((img) => {
        const randomWidth = Math.floor(Math.random() * (450 - 250 + 1)) + 250;
        const randomHeight = Math.floor(Math.random() * (400 - 200 + 1)) + 200;
        (img as HTMLElement).style.width = `${randomWidth}px`;
        (img as HTMLElement).style.height = `${randomHeight}px`;
      });

      const scrollTrigger = ScrollTrigger.create({
        trigger: ".komparacija",
        start: "top top",
        end: `+=${window.innerHeight * 3.5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,

        onUpdate: (self) => {
          const progress = self.progress;
          const phaseOneStartOffsets = [0.1, 0.18, 0.26, 0.34];

          komparacijaSlike.forEach((img, index) => {
            const initialRotation = initialRotations[index];
            const phase1Start = phaseOneStartOffsets[index];
            const phase1End = Math.min(
              phase1Start + (0.5 - phase1Start) * 0.9,
              0.5
            );

            let x = -50;
            let y, rotation, opacity;

            if (progress < phase1Start) {
              y = 300;
              rotation = initialRotation;
              opacity = 0;
            } else if (progress <= 0.5) {
              let phase1Progress;

              if (progress >= phase1End) {
                phase1Progress = 1;
              } else {
                const linearProgress =
                  (progress - phase1Start) / (phase1End - phase1Start);
                phase1Progress = 1 - Math.pow(1 - linearProgress, 3);
              }
              y = 250 - phase1Progress * 330;
              rotation = initialRotation;
              opacity = Math.min(phase1Progress * 2, 1);
            } else {
              y = -80;
              rotation = initialRotation;
              opacity = 1;
            }

            const phaseTwoStartOffsets = [0.5, 0.52, 0.54, 0.56];
            const phase2Start = phaseTwoStartOffsets[index];
            const phase2End = Math.min(
              phase2Start + (0.95 - phase2Start) * 0.9,
              0.95
            );
            const finalX = komparacijaFinalPosition[index][0];
            const finalY = komparacijaFinalPosition[index][1];

            if (progress >= phase2Start && progress <= 0.95) {
              let phase2Progress;

              if (progress >= phase2End) {
                phase2Progress = 1;
              } else {
                const linearProgress =
                  (progress - phase2Start) / (phase2End - phase2Start);
                phase2Progress = 1 - Math.pow(1 - linearProgress, 3);
              }

              x = -50 + (finalX + 50) * phase2Progress;
              y = -80 + (finalY + 80) * phase2Progress;
              rotation = initialRotation * (1 - phase2Progress);
            } else if (progress > 0.95) {
              x = finalX;
              y = finalY;
              rotation = 0;
            }

            gsap.set(img, {
              transform: `translate(${x}%, ${y}%) rotate(${rotation}deg)`,
              opacity: opacity,
            });
          });
        },
      });

      return { scrollTrigger };
    };

    timeout = setTimeout(() => {
      animation = initAnimation();
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (animation) {
        if (animation.scrollTrigger) animation.scrollTrigger.kill();
      }
    };
  }, []);
}

export default useKomparacijaAnimation;
