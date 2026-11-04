import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Total scroll distance (px) mapped onto the lid-open + camera-dolly scrub.
const SCROLL_LENGTH = 2000;

// Hinge angles (deg):
// .laptop-base sits at rotateX(82deg). At rotateX(-98deg), .laptop-lid lies
// completely parallel to the keyboard deck (82 - (-98) = 180°). Rotating to
// 0deg opens the lid through 98° into the viewport plane so nested HTML
// renders distortion-free and pixel-locked as the camera dollies in.
const LID_CLOSED_ANGLE = -98;
const LID_OPEN_ANGLE = 0;
const BASE_TILT_ANGLE = 82;

// Authentic 6-row MacBook Pro Magic Keyboard layout (unit weights per row).
const KEYBOARD_ROWS = [
  {
    compact: true,
    keys: [
      { id: 'esc', label: 'esc', w: 1.45, align: 'left' },
      { id: 'f1', label: 'F1' },
      { id: 'f2', label: 'F2' },
      { id: 'f3', label: 'F3' },
      { id: 'f4', label: 'F4' },
      { id: 'f5', label: 'F5' },
      { id: 'f6', label: 'F6' },
      { id: 'f7', label: 'F7' },
      { id: 'f8', label: 'F8' },
      { id: 'f9', label: 'F9' },
      { id: 'f10', label: 'F10' },
      { id: 'f11', label: 'F11' },
      { id: 'f12', label: 'F12' },
      { id: 'touch-id', touchId: true },
    ],
  },
  {
    keys: [
      { id: 'grave', label: '`' },
      { id: '1', label: '1' },
      { id: '2', label: '2' },
      { id: '3', label: '3' },
      { id: '4', label: '4' },
      { id: '5', label: '5' },
      { id: '6', label: '6' },
      { id: '7', label: '7' },
      { id: '8', label: '8' },
      { id: '9', label: '9' },
      { id: '0', label: '0' },
      { id: 'minus', label: '-' },
      { id: 'equal', label: '=' },
      { id: 'delete', label: '⌫', w: 1.55, align: 'right' },
    ],
  },
  {
    keys: [
      { id: 'tab', label: '⇥', w: 1.55, align: 'left' },
      { id: 'q', label: 'Q' },
      { id: 'w', label: 'W' },
      { id: 'e', label: 'E' },
      { id: 'r', label: 'R' },
      { id: 't', label: 'T' },
      { id: 'y', label: 'Y' },
      { id: 'u', label: 'U' },
      { id: 'i', label: 'I' },
      { id: 'o', label: 'O' },
      { id: 'p', label: 'P' },
      { id: 'lbracket', label: '[' },
      { id: 'rbracket', label: ']' },
      { id: 'backslash', label: '\\' },
    ],
  },
  {
    keys: [
      { id: 'caps', label: '⇪', w: 1.8, align: 'left', capsDot: true },
      { id: 'a', label: 'A' },
      { id: 's', label: 'S' },
      { id: 'd', label: 'D' },
      { id: 'f', label: 'F', homing: true },
      { id: 'g', label: 'G' },
      { id: 'h', label: 'H' },
      { id: 'j', label: 'J', homing: true },
      { id: 'k', label: 'K' },
      { id: 'l', label: 'L' },
      { id: 'semicolon', label: ';' },
      { id: 'quote', label: "'" },
      { id: 'return', label: '⏎', w: 1.85, align: 'right' },
    ],
  },
  {
    keys: [
      { id: 'lshift', label: '⇧', w: 2.35, align: 'left' },
      { id: 'z', label: 'Z' },
      { id: 'x', label: 'X' },
      { id: 'c', label: 'C' },
      { id: 'v', label: 'V' },
      { id: 'b', label: 'B' },
      { id: 'n', label: 'N' },
      { id: 'm', label: 'M' },
      { id: 'comma', label: ',' },
      { id: 'period', label: '.' },
      { id: 'slash', label: '/' },
      { id: 'rshift', label: '⇧', w: 2.35, align: 'right' },
    ],
  },
  {
    keys: [
      { id: 'fn', label: 'fn', align: 'left' },
      { id: 'ctrl', label: '⌃' },
      { id: 'lopt', label: '⌥' },
      { id: 'lcmd', label: '⌘', w: 1.28 },
      { id: 'space', label: '', w: 5.2, space: true },
      { id: 'rcmd', label: '⌘', w: 1.28 },
      { id: 'ropt', label: '⌥' },
      { id: 'arrow-left', label: '◀', halfBottom: true },
      { id: 'arrow-updown', splitArrows: true },
      { id: 'arrow-right', label: '▶', halfBottom: true },
    ],
  },
];

function LaptopScrub({ children }) {
  const sectionRef = useRef(null);
  const dollyRef = useRef(null);
  const lidRef = useRef(null);
  const baseRef = useRef(null);
  const wakeRef = useRef(null);
  const glareRef = useRef(null);
  const shadowRef = useRef(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mm = gsap.matchMedia();

    mm.add(
      '(min-width: 981px) and (prefers-reduced-motion: no-preference)',
      () => {
        const section = sectionRef.current;
        const dolly = dollyRef.current;
        const lid = lidRef.current;
        const base = baseRef.current;
        const wake = wakeRef.current;
        const glare = glareRef.current;
        const shadow = shadowRef.current;

        if (!section || !dolly || !lid || !base) {
          return undefined;
        }

        const getStartScale = () => {
          const lidW = lid.offsetWidth || 1280;
          const lidH = lid.offsetHeight || 820;
          const fit = Math.min(
            (window.innerWidth * 0.56) / lidW,
            (window.innerHeight * 0.54) / lidH
          );
          return Math.max(0.38, Math.min(0.64, fit));
        };

        const getEndScale = () => {
          const lidW = lid.offsetWidth || 1280;
          const lidH = lid.offsetHeight || 820;
          // Cap at 1 so the GPU layer never upscales past its native raster
          // resolution, keeping typography razor-sharp throughout the scrub.
          return Math.min(
            1,
            (window.innerWidth * 0.96) / lidW,
            (window.innerHeight * 0.94) / lidH
          );
        };

        const getMidScale = () =>
          Math.min(getEndScale(), getStartScale() * 1.18);

        gsap.set(dolly, {
          yPercent: -26,
          z: -380,
          rotateX: 4,
          scale: () => getStartScale(),
          force3D: true,
        });
        gsap.set(lid, {
          rotateX: LID_CLOSED_ANGLE,
          force3D: true,
        });
        gsap.set(base, {
          rotateX: BASE_TILT_ANGLE,
          autoAlpha: 1,
          force3D: true,
        });
        if (wake) {
          gsap.set(wake, { opacity: 0.9 });
        }
        if (glare) {
          gsap.set(glare, { xPercent: -26, opacity: 0, force3D: true });
        }
        if (shadow) {
          gsap.set(shadow, { scale: 0.88, autoAlpha: 0.8, force3D: true });
        }

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: `+=${SCROLL_LENGTH}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Phase 1 (0.00 -> 0.46): Swing the lid open ~98° while easing the
        // camera dolly into a balanced mid-shot of the open laptop.
        timeline.to(
          lid,
          {
            rotateX: LID_OPEN_ANGLE,
            ease: 'power2.inOut',
            duration: 0.46,
          },
          0
        );

        timeline.to(
          dolly,
          {
            yPercent: -5,
            z: -230,
            rotateX: 2,
            scale: () => getMidScale(),
            ease: 'sine.inOut',
            duration: 0.42,
          },
          0
        );

        if (wake) {
          timeline.to(
            wake,
            {
              opacity: 0,
              ease: 'power2.out',
              duration: 0.32,
            },
            0.1
          );
        }

        if (glare) {
          timeline.to(
            glare,
            {
              xPercent: 10,
              opacity: 0.55,
              ease: 'sine.out',
              duration: 0.34,
            },
            0.1
          );
        }

        if (shadow) {
          timeline.to(
            shadow,
            {
              scale: 1.04,
              autoAlpha: 0.55,
              ease: 'sine.inOut',
              duration: 0.42,
            },
            0
          );
        }

        // Phase 2 (0.42 -> 1.00): Dolly straight into the open display bezel
        // until it fills the viewport at native 1:1 resolution.
        timeline.to(
          dolly,
          {
            yPercent: 0,
            z: 0,
            rotateX: 0,
            scale: () => getEndScale(),
            ease: 'power2.inOut',
            duration: 0.58,
          },
          0.42
        );

        timeline.to(
          base,
          {
            autoAlpha: 0,
            ease: 'power2.in',
            duration: 0.38,
          },
          0.48
        );

        if (shadow) {
          timeline.to(
            shadow,
            {
              scale: 1.24,
              autoAlpha: 0,
              ease: 'power1.in',
              duration: 0.34,
            },
            0.46
          );
        }

        if (glare) {
          timeline.to(
            glare,
            {
              xPercent: 40,
              opacity: 0,
              ease: 'power1.inOut',
              duration: 0.42,
            },
            0.46
          );
        }

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      className="laptop-scrub"
      ref={sectionRef}
      aria-label="Portfolio showcase animation"
    >
      <div className="laptop-rig-container">
        <div className="laptop-camera-dolly" ref={dollyRef}>
          <div className="laptop-lid" ref={lidRef}>
            <div className="lid-volume" aria-hidden="true">
              <div className="laptop-lid-back">
                <span className="laptop-lid-emblem" />
              </div>
              <div className="laptop-lid-layer is-deep" />
              <div className="laptop-lid-layer is-mid" />
              <div className="laptop-lid-layer is-shallow" />
              <span className="lid-edge lid-edge-top" />
              <span className="lid-edge lid-edge-bottom" />
              <span className="lid-edge lid-edge-left" />
              <span className="lid-edge lid-edge-right" />
              <div className="lid-corner lid-corner-tl">
                <span />
              </div>
              <div className="lid-corner lid-corner-tr">
                <span />
              </div>
            </div>
            <div className="laptop-lid-rim" aria-hidden="true" />

            <div className="laptop-bezel">
              <div className="laptop-camera-notch" aria-hidden="true">
                <span className="laptop-camera-sensor" />
                <span className="laptop-camera-lens" />
                <span className="laptop-camera-led" />
              </div>
              {children}
              <div
                className="laptop-screen-wake"
                ref={wakeRef}
                aria-hidden="true"
              />
              <div
                className="laptop-screen-glare"
                ref={glareRef}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="laptop-base" ref={baseRef} aria-hidden="true">
            <div className="base-volume">
              <div className="base-layer base-layer-bevel-top" />
              <div className="base-layer base-layer-upper" />
              <div className="base-layer base-layer-mid" />
              <div className="base-layer base-layer-lower" />
              <div className="base-layer base-layer-chamfer-1" />
              <div className="base-layer base-layer-chamfer-2" />

              <div className="base-face base-face-bottom">
                <div className="base-bottom-plate" />
                <span className="base-foot base-foot-fl" />
                <span className="base-foot base-foot-fr" />
                <span className="base-foot base-foot-bl" />
                <span className="base-foot base-foot-br" />
              </div>

              <div className="base-face base-face-front">
                <div className="base-indent" />
              </div>
              <div className="base-face base-face-back" />

              <div className="base-face base-face-left">
                <div className="base-io-cluster">
                  <span className="base-port base-port-magsafe" />
                  <span className="base-port base-port-usbc" />
                  <span className="base-port base-port-usbc" />
                  <span className="base-port base-port-jack" />
                </div>
                <span className="base-vent" />
              </div>

              <div className="base-face base-face-right">
                <div className="base-io-cluster">
                  <span className="base-port base-port-hdmi" />
                  <span className="base-port base-port-usbc" />
                  <span className="base-port base-port-sdxc" />
                </div>
                <span className="base-vent" />
              </div>

              <div className="base-corner base-corner-fl">
                <span />
              </div>
              <div className="base-corner base-corner-fr">
                <span />
              </div>
              <div className="base-corner base-corner-bl" />
              <div className="base-corner base-corner-br" />

              <div className="base-face base-face-top">
                <div className="laptop-screen-glow" />
                <div className="laptop-hinge" />

                <div className="laptop-deck">
                  <div className="laptop-speaker" />
                  <div className="laptop-keyboard-well">
                    {KEYBOARD_ROWS.map((row, rowIndex) => (
                      <div
                        className={`laptop-key-row${row.compact ? ' is-compact' : ''}`}
                        key={rowIndex}
                      >
                        {row.keys.map((key) => {
                          if (key.splitArrows) {
                            return (
                              <div
                                className="laptop-key-split"
                                key={key.id}
                                style={{ '--w': key.w || 1 }}
                              >
                                <span className="laptop-key is-half">▲</span>
                                <span className="laptop-key is-half">▼</span>
                              </div>
                            );
                          }
                          const classes = [
                            'laptop-key',
                            key.align ? `is-${key.align}` : '',
                            key.touchId ? 'is-touch-id' : '',
                            key.space ? 'is-space' : '',
                            key.homing ? 'is-homing' : '',
                            key.halfBottom ? 'is-half-bottom' : '',
                          ]
                            .filter(Boolean)
                            .join(' ');

                          return (
                            <span
                              className={classes}
                              key={key.id}
                              style={key.w ? { '--w': key.w } : undefined}
                            >
                              {key.capsDot && <i className="laptop-caps-dot" />}
                              {key.touchId ? (
                                <i className="laptop-touch-id-ring" />
                              ) : (
                                key.label
                              )}
                            </span>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="laptop-speaker" />
                </div>

                <div className="laptop-trackpad" />
              </div>
            </div>
          </div>

          <div
            className="laptop-desk-shadow"
            ref={shadowRef}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}

export default LaptopScrub;
