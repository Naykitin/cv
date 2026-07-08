import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, select, label, [role="button"]';

function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const finePointer = window.matchMedia('(pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!finePointer.matches || reducedMotion.matches) {
      return undefined;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) {
      return undefined;
    }

    document.documentElement.classList.add('has-custom-cursor');

    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let ringX = pointerX;
    let ringY = pointerY;
    let visible = false;
    let frame;

    const setVisible = (nextVisible) => {
      visible = nextVisible;
      const opacity = nextVisible ? '1' : '0';
      dot.style.opacity = opacity;
      ring.style.opacity = opacity;
    };

    const handlePointerMove = (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!visible) {
        ringX = pointerX;
        ringY = pointerY;
        setVisible(true);
      }

      dot.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
    };

    const handlePointerLeave = () => setVisible(false);
    const handlePointerDown = () => ring.classList.add('is-pressed');
    const handlePointerUp = () => ring.classList.remove('is-pressed');

    const handlePointerOver = (event) => {
      if (event.target.closest(INTERACTIVE_SELECTOR)) {
        ring.classList.add('is-active');
      }
    };

    const handlePointerOut = (event) => {
      if (event.target.closest(INTERACTIVE_SELECTOR)) {
        ring.classList.remove('is-active');
      }
    };

    const followPointer = () => {
      ringX += (pointerX - ringX) * 0.16;
      ringY += (pointerY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      frame = requestAnimationFrame(followPointer);
    };

    frame = requestAnimationFrame(followPointer);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}

export default CustomCursor;
