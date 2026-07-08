import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- Frame sequence config -------------------------------------------------
// Rendered from Blender: 150 frames, transparent WebP, 1600x1000.
// Frames 1-60 open the lid; 60-150 dolly straight in until the display
// fills the whole frame.
const FRAME_COUNT = 150;
const FRAME_DIR = '/frames';
const IMAGE_W = 1600;
const IMAGE_H = 1000;
const framePath = (i) =>
  `${FRAME_DIR}/frame_${String(i).padStart(4, '0')}.webp`;

// Total scroll distance (px) mapped onto the full sequence. More = slower scrub.
const SCROLL_LENGTH = 3000;

// The frame zoom completes at this fraction of the pin; the rest is a tail
// where the rendered laptop dissolves, leaving the mac window on the page
// itself for a seamless handoff into the next section.
const ZOOM_END = 0.88;
const CANVAS_FADE_START = 0.9;

// The laptop display's rect in image pixels, measured at key frames.
// { p: progress (frame-1)/149, cx/cy: display center, w: display width }
const DISPLAY_KEYFRAMES = [
  { p: 0.396, cx: 802, cy: 489, w: 589 },
  { p: 0.53, cx: 801, cy: 489, w: 613 },
  { p: 0.698, cx: 798, cy: 489, w: 852 },
  { p: 0.832, cx: 804, cy: 468, w: 1248 },
  { p: 1, cx: 800, cy: 500, w: 1620 },
];

// Overlay base size in px; must match .laptop-scrub-screen CSS.
// Aspect ~1.47 = the rendered display's aspect ratio.
const BASE_W = 1000;
const BASE_H = 680;

// Screen content fades in as the lid finishes opening and the dolly begins.
const FADE_IN_START = 0.4;
const FADE_IN_END = 0.52;

function displayRectAt(progress) {
  const frames = DISPLAY_KEYFRAMES;
  if (progress <= frames[0].p) {
    return frames[0];
  }
  for (let i = 1; i < frames.length; i += 1) {
    if (progress <= frames[i].p) {
      const a = frames[i - 1];
      const b = frames[i];
      const t = (progress - a.p) / (b.p - a.p);
      return {
        cx: a.cx + (b.cx - a.cx) * t,
        cy: a.cy + (b.cy - a.cy) * t,
        w: a.w + (b.w - a.w) * t,
      };
    }
  }
  return frames[frames.length - 1];
}

function LaptopScrub({ children }) {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const screenRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    // Sequence only runs on desktop; mobile shows the static card via CSS.
    if (!window.matchMedia('(min-width: 981px)').matches) {
      return undefined;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      return undefined;
    }

    const frames = new Array(FRAME_COUNT);
    let loaded = 0;
    let cancelled = false;
    let currentIndex = -1;
    let rafId = 0;

    // --- Canvas sizing (DPR-aware) -----------------------------------------
    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.round(clientWidth * dpr);
      canvas.height = Math.round(clientHeight * dpr);
    };

    // "Contain" fit of the 1600x1000 frame inside the canvas, in CSS pixels.
    const containFit = () => {
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      const scale = Math.min(cw / IMAGE_W, ch / IMAGE_H);
      return {
        scale,
        offsetX: (cw - IMAGE_W * scale) / 2,
        offsetY: (ch - IMAGE_H * scale) / 2,
      };
    };

    const drawFrame = (index) => {
      const img = frames[index];
      if (!img || !img.complete || img.naturalWidth === 0) {
        return;
      }
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const renderIndex = (index) => {
      const clamped = Math.max(0, Math.min(FRAME_COUNT - 1, index));
      if (clamped === currentIndex) {
        return;
      }
      currentIndex = clamped;
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => drawFrame(clamped));
    };

    // Pin the DOM overlay to the rendered display: uniform scale + center.
    const positionOverlay = (p) => {
      const screen = screenRef.current;
      if (!screen) {
        return;
      }
      const rect = displayRectAt(p);
      const fit = containFit();
      const w = rect.w * fit.scale;
      const scale = w / BASE_W;
      const x = fit.offsetX + rect.cx * fit.scale - (BASE_W * scale) / 2;
      const y = fit.offsetY + rect.cy * fit.scale - (BASE_H * scale) / 2;
      gsap.set(screen, { x, y, scale });
    };

    // --- Preload all frames ------------------------------------------------
    for (let i = 0; i < FRAME_COUNT; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(i + 1);
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded === FRAME_COUNT && !cancelled) {
          setReady(true);
        }
        setProgress(loaded / FRAME_COUNT);
      };
      frames[i] = img;
    }

    // --- ScrollTrigger + timeline ------------------------------------------
    const mm = gsap.matchMedia();
    mm.add('(min-width: 981px)', () => {
      const section = sectionRef.current;
      const screen = screenRef.current;
      const proxy = { progress: 0 };

      sizeCanvas();
      positionOverlay(0);
      const onResize = () => {
        sizeCanvas();
        drawFrame(currentIndex < 0 ? 0 : currentIndex);
        positionOverlay(proxy.progress);
      };
      window.addEventListener('resize', onResize);

      const timeline = gsap.timeline({
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
            // Frames finish at ZOOM_END and hold; the tail is the dissolve.
            const fp = Math.min(1, proxy.progress / ZOOM_END);
            renderIndex(Math.round(fp * (FRAME_COUNT - 1)));
            positionOverlay(fp);
          },
        },
        0
      );

      // The display content appears once the lid is open and stays on:
      // by the end of the zoom it has become the full viewport.
      timeline.fromTo(
        screen,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: 'power1.inOut', duration: FADE_IN_END - FADE_IN_START },
        FADE_IN_START
      );

      // Once the display fills the viewport, dissolve the rendered laptop:
      // the mac window is left standing on the page background.
      timeline.to(
        canvas,
        { autoAlpha: 0, ease: 'power1.inOut', duration: 1 - CANVAS_FADE_START },
        CANVAS_FADE_START
      );

      renderIndex(0);

      return () => {
        window.removeEventListener('resize', onResize);
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      mm.revert();
    };
  }, []);

  return (
    <section
      className="laptop-scrub"
      ref={sectionRef}
      aria-label="Portfolio showcase animation"
    >
      <canvas ref={canvasRef} className="laptop-scrub-canvas" />
      {!ready && (
        <div className="laptop-scrub-loader" aria-hidden="true">
          <span style={{ '--p': progress }} />
        </div>
      )}
      <div className="laptop-scrub-screen" ref={screenRef}>
        {children}
      </div>
    </section>
  );
}

export default LaptopScrub;
