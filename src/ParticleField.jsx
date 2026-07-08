import { useEffect, useRef } from 'react';

const COLORS = [
  [255, 205, 89],
  [229, 106, 79],
  [67, 171, 141],
  [244, 238, 227],
];

const LINK_DISTANCE = 120;
const POINTER_DISTANCE = 190;
const DRIFT_SPEED = 0.6;

function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return undefined;
    }

    if (
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let particles = [];
    let frame;
    const pointer = { x: -10000, y: -10000 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(130, Math.floor((width * height) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
        r: 1 + Math.random() * 1.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      for (const particle of particles) {
        const dx = particle.x - pointer.x;
        const dy = particle.y - pointer.y;
        const pointerDistance = Math.hypot(dx, dy);

        if (pointerDistance < POINTER_DISTANCE && pointerDistance > 0) {
          const force = (1 - pointerDistance / POINTER_DISTANCE) * 0.3;
          particle.vx += (dx / pointerDistance) * force;
          particle.vy += (dy / pointerDistance) * force;
        }

        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed > DRIFT_SPEED) {
          particle.vx *= 0.96;
          particle.vy *= 0.96;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;
      }

      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;

          if (Math.abs(dx) > LINK_DISTANCE || Math.abs(dy) > LINK_DISTANCE) {
            continue;
          }

          const distance = Math.hypot(dx, dy);

          if (distance < LINK_DISTANCE) {
            ctx.strokeStyle = `rgba(244, 238, 227, ${(1 - distance / LINK_DISTANCE) * 0.07})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        const pointerDistance = Math.hypot(a.x - pointer.x, a.y - pointer.y);

        if (pointerDistance < POINTER_DISTANCE) {
          ctx.strokeStyle = `rgba(255, 205, 89, ${(1 - pointerDistance / POINTER_DISTANCE) * 0.16})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(${a.color.join(', ')}, 0.5)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fill();
      }

      frame = requestAnimationFrame(step);
    };

    const handlePointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    const handlePointerLeave = () => {
      pointer.x = -10000;
      pointer.y = -10000;
    };

    resize();
    frame = requestAnimationFrame(step);

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return <canvas className="bg-canvas" ref={canvasRef} aria-hidden="true" />;
}

export default ParticleField;
