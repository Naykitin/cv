import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FONT = "12.5px 'JetBrains Mono', ui-monospace, 'Cascadia Code', monospace";
const LINE_HEIGHT = 21;
const PAD_X = 18;
const PAD_Y = 16;

const COLORS = {
  ink: 'rgba(244, 238, 227, 0.92)',
  muted: 'rgba(168, 159, 144, 0.85)',
  green: '#43ab8d',
  gold: '#ffcd59',
  red: '#e56a4f',
  blue: '#7ba2d8',
};

// A looping fake session. `cmd` lines are typed keystroke by keystroke after
// a `$ ` prompt; `out` lines print whole, like real command output.
const SCRIPT = [
  { type: 'cmd', segs: [{ t: 'whoami', c: 'ink' }] },
  { type: 'out', segs: [{ t: 'vladyslav · full-stack developer', c: 'muted' }] },
  { type: 'out', segs: [] },
  { type: 'cmd', segs: [{ t: 'cat ', c: 'ink' }, { t: 'stack.config.ts', c: 'gold' }] },
  {
    type: 'out',
    segs: [
      { t: 'export const ', c: 'red' },
      { t: 'stack', c: 'blue' },
      { t: ' = {', c: 'ink' },
    ],
  },
  {
    type: 'out',
    segs: [
      { t: '  frontend', c: 'ink' },
      { t: ': [', c: 'muted' },
      { t: "'react'", c: 'gold' },
      { t: ', ', c: 'muted' },
      { t: "'next.js'", c: 'gold' },
      { t: ', ', c: 'muted' },
      { t: "'vite'", c: 'gold' },
      { t: '],', c: 'muted' },
    ],
  },
  {
    type: 'out',
    segs: [
      { t: '  platforms', c: 'ink' },
      { t: ': [', c: 'muted' },
      { t: "'wordpress'", c: 'gold' },
      { t: ', ', c: 'muted' },
      { t: "'shopify'", c: 'gold' },
      { t: '],', c: 'muted' },
    ],
  },
  {
    type: 'out',
    segs: [
      { t: '  dataflow', c: 'ink' },
      { t: ': [', c: 'muted' },
      { t: "'graphql'", c: 'gold' },
      { t: ', ', c: 'muted' },
      { t: "'crm'", c: 'gold' },
      { t: ', ', c: 'muted' },
      { t: "'payments'", c: 'gold' },
      { t: '],', c: 'muted' },
    ],
  },
  { type: 'out', segs: [{ t: '};', c: 'ink' }] },
  { type: 'out', segs: [] },
  { type: 'cmd', segs: [{ t: 'git push origin ', c: 'ink' }, { t: 'deploy', c: 'blue' }] },
  { type: 'out', segs: [{ t: '→ GitHub Actions: build + deploy triggered', c: 'muted' }] },
  { type: 'out', segs: [{ t: '✓ 128 modules transformed in 1.4s', c: 'green' }] },
  { type: 'out', segs: [{ t: '✓ pushed to naykitin.github.io · 0 errors', c: 'green' }] },
  { type: 'out', segs: [{ t: '→ live on production', c: 'gold' }] },
];

const CMD_KEY_MIN = 34; // ms per typed character, randomized
const CMD_KEY_VAR = 40;
const OUT_DELAY = 130; // pause before an output line prints
const CMD_DELAY = 480; // "thinking" pause before the next command is typed
const LOOP_HOLD = 3600; // hold the finished session before clearing
const CURSOR_BLINK = 530;

function HeroTerminal() {
  const rootRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const canvas = canvasRef.current;
    const root = rootRef.current;
    if (!canvas || !root) {
      return undefined;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return undefined;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let rafId = 0;
    let running = false;
    // Typing state: position inside SCRIPT + chars typed of the current line.
    let lineIndex = 0;
    let charCount = 0;
    let nextEventAt = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.round(clientWidth * dpr);
      canvas.height = Math.round(clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const lineChars = (line) => line.segs.reduce((n, s) => n + s.t.length, 0);

    // Draws the session: every finished line, the partial line being typed,
    // and the cursor. Lines scroll up if they outgrow the canvas.
    const draw = (now) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.font = FONT;
      ctx.textBaseline = 'top';

      const doneTyping = lineIndex >= SCRIPT.length;
      const rows = [];
      for (let i = 0; i < Math.min(lineIndex + 1, SCRIPT.length); i += 1) {
        rows.push({ line: SCRIPT[i], chars: i < lineIndex ? Infinity : charCount });
      }

      const maxRows = Math.floor((h - PAD_Y * 2 - LINE_HEIGHT) / LINE_HEIGHT);
      const visible = rows.slice(Math.max(0, rows.length - maxRows));

      let y = PAD_Y;
      let cursorX = PAD_X;
      let cursorY = y;

      for (const { line, chars } of visible) {
        let x = PAD_X;
        if (line.type === 'cmd') {
          ctx.fillStyle = COLORS.green;
          ctx.fillText('$ ', x, y);
          x += ctx.measureText('$ ').width;
        }
        let budget = chars;
        for (const seg of line.segs) {
          const text = budget === Infinity ? seg.t : seg.t.slice(0, Math.max(0, budget));
          if (text) {
            ctx.fillStyle = COLORS[seg.c] || COLORS.ink;
            ctx.fillText(text, x, y);
            x += ctx.measureText(text).width;
          }
          if (budget !== Infinity) {
            budget -= seg.t.length;
          }
        }
        cursorX = x;
        cursorY = y;
        y += LINE_HEIGHT;
      }

      // Cursor sits after the typed text, or on a fresh prompt line once the
      // session has finished printing.
      if (doneTyping) {
        cursorY = Math.min(y, PAD_Y + maxRows * LINE_HEIGHT);
        ctx.fillStyle = COLORS.green;
        ctx.fillText('$ ', PAD_X, cursorY);
        cursorX = PAD_X + ctx.measureText('$ ').width;
      }
      const blinkOn = reducedMotion || Math.floor(now / CURSOR_BLINK) % 2 === 0;
      if (blinkOn) {
        ctx.fillStyle = 'rgba(255, 205, 89, 0.85)';
        ctx.fillRect(cursorX + 1, cursorY + 1, 7, LINE_HEIGHT - 6);
      }
    };

    const step = (now) => {
      if (!running) {
        return;
      }

      if (now >= nextEventAt && lineIndex < SCRIPT.length) {
        const line = SCRIPT[lineIndex];
        if (line.type === 'cmd') {
          charCount += 1;
          nextEventAt = now + CMD_KEY_MIN + Math.random() * CMD_KEY_VAR;
        } else {
          charCount = lineChars(line);
          nextEventAt = now + OUT_DELAY;
        }
        if (charCount >= lineChars(line)) {
          lineIndex += 1;
          charCount = 0;
          const next = SCRIPT[lineIndex];
          if (lineIndex >= SCRIPT.length) {
            nextEventAt = now + LOOP_HOLD;
          } else if (next.type === 'cmd') {
            nextEventAt = now + CMD_DELAY;
          }
        }
      } else if (now >= nextEventAt && lineIndex >= SCRIPT.length) {
        // Session held long enough: clear and replay.
        lineIndex = 0;
        charCount = 0;
        nextEventAt = now + 600;
      }

      draw(now);
      rafId = requestAnimationFrame(step);
    };

    const start = () => {
      if (running || reducedMotion) {
        return;
      }
      running = true;
      nextEventAt = performance.now() + 400;
      rafId = requestAnimationFrame(step);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    const onResize = () => {
      sizeCanvas();
      draw(performance.now());
    };

    sizeCanvas();

    if (reducedMotion) {
      // No animation: render the whole session as a static screen.
      lineIndex = SCRIPT.length;
      draw(0);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }

    window.addEventListener('resize', onResize);

    // Only burn frames while the hero is actually on screen.
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 }
    );
    observer.observe(root);

    // Dissolve while scrolling from the hero into the laptop section: fully
    // gone by the time the hero has left the viewport.
    const mm = gsap.matchMedia();
    mm.add('(min-width: 981px)', () => {
      const fade = gsap.to(root, {
        autoAlpha: 0,
        y: -48,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      return () => {
        fade.scrollTrigger?.kill();
        fade.kill();
      };
    });

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener('resize', onResize);
      mm.revert();
    };
  }, []);

  return (
    <aside className="hero-terminal" ref={rootRef} aria-hidden="true">
      <div className="hero-terminal-window reveal">
        <div className="hero-terminal-bar">
          <span className="traffic-lights">
            <i />
            <i />
            <i />
          </span>
          <span>~/vlad/dev — zsh</span>
          <span>live</span>
        </div>
        <canvas ref={canvasRef} />
      </div>
    </aside>
  );
}

export default HeroTerminal;
