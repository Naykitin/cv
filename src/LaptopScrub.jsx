import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Total scroll distance (px) mapped onto the full video. More = slower scrub.
const SCROLL_LENGTH = 2600;

// Where things happen as a fraction of the video (0 → 1).
// Tune these to match the Blender animation: lid starts opening, lid fully
// open, zoom begins, zoom fills the frame.
const PHASE = {
  screenIn: 0.38,
  screenFull: 0.55,
  zoomStart: 0.78,
  zoomEnd: 0.97,
};

function LaptopScrub({ children }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const screenRef = useRef(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const section = sectionRef.current;
    const video = videoRef.current;
    const screen = screenRef.current;

    if (!section || !video || !screen) {
      return undefined;
    }

    const mm = gsap.matchMedia();

    mm.add('(min-width: 981px)', () => {
      let timeline;
      let lastTime = -1;

      const build = () => {
        const proxy = { progress: 0 };
        // Stay just short of the end so the last frame never flickers to black.
        const scrubbable = Math.max(0, video.duration - 0.05);

        timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${SCROLL_LENGTH}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        timeline.to(
          proxy,
          {
            progress: 1,
            ease: 'none',
            duration: 1,
            onUpdate: () => {
              const time = proxy.progress * scrubbable;
              // Skip sub-frame seeks; the video is encoded at 30fps.
              if (Math.abs(time - lastTime) < 1 / 30) {
                return;
              }
              lastTime = time;
              video.currentTime = time;
            },
          },
          0
        );

        timeline.fromTo(
          screen,
          { autoAlpha: 0, scale: 0.9 },
          { autoAlpha: 1, scale: 1, ease: 'power1.out', duration: PHASE.screenFull - PHASE.screenIn },
          PHASE.screenIn
        );

        timeline.to(
          screen,
          { scale: 1.7, autoAlpha: 0, ease: 'power1.in', duration: PHASE.zoomEnd - PHASE.zoomStart },
          PHASE.zoomStart
        );
      };

      if (video.readyState >= 1) {
        build();
      } else {
        video.addEventListener('loadedmetadata', build, { once: true });
      }

      return () => {
        video.removeEventListener('loadedmetadata', build);
        if (timeline) {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        }
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="laptop-scrub" ref={sectionRef} aria-label="Portfolio showcase animation">
      <video
        ref={videoRef}
        className="laptop-scrub-video"
        src="/laptop-scrub.mp4"
        muted
        playsInline
        preload="auto"
        tabIndex={-1}
      />
      <div className="laptop-scrub-screen" ref={screenRef}>
        {children}
      </div>
    </section>
  );
}

export default LaptopScrub;
