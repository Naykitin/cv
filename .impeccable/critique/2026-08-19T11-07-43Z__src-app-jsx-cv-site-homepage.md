---
target: CV site homepage (src/App.jsx)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
timestamp: 2026-08-19T11-07-43Z
slug: src-app-jsx-cv-site-homepage
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Geo-based CV/contact swap is invisible; no progress indicator on a ~9-screen page |
| 2 | Match System / Real World | 3 | Deep technical jargon unglossed in visible project copy |
| 3 | User Control and Freedom | 2 | No back-to-top; no manual override if IP geolocation guesses wrong |
| 4 | Consistency and Standards | 3 | Strong token reuse; "Download CV" vs "Open PDF" behave differently for the same file |
| 5 | Error Prevention | 3 | Native validation + disabled submit-during-send; no inline field-level messaging |
| 6 | Recognition Rather Than Recall | 3 | Everything visible via scroll, all icons labeled |
| 7 | Flexibility and Efficiency | n/a | Single-scroll CV with no repeat-task workflow |
| 8 | Aesthetic and Minimalist Design | 4 | Verified WCAG-AA+ contrast everywhere tested |
| 9 | Error Recovery | 3 | Form failure state is plain-language with a working fallback |
| 10 | Help and Documentation | n/a | Not applicable |
| Total | | 23/32 | Good (71.9%) |

## Design Specificity Verdict
High in craft/motion (LaptopScrub, HeroTerminal, ParticleField, CustomCursor all bespoke and reduced-motion-gated), conventional in structural IA (hero/services/timeline/contact shape reusable by any dev portfolio). Detector's ai-color-palette (25x "cyan neon") traced to var(--green) #43ab8d — likely false positive, not neon. kicker-above-heading (4x) is the site's own deliberate .section-label system. cramped-padding (3x) and nested-cards (1x) are plausible genuine items.

## Priority Issues
[P1] Horizontal page overflow on desktop from Experience timeline — GSAP ScrollTrigger pin in useScrollEffects.js:50-77 escapes .portfolio-shell's untransformed overflow:hidden (App.css:45-48) via default position:fixed pinning. Fix: pinType: 'transform' or add a transform to an ancestor.
[P1] No persistent path to conversion actions past the hero — add sticky/floating CTA once hero scrolls out of view.
[P2] Four undifferentiated redundant contact channels — pick one primary, demote rest.
[P2] Flat 13-item skill cloud undercuts "versatility" positioning — group into 2-3 labeled clusters.
[P2] AI-assisted/CI-CD evidence invisible on page — surface the real pipeline/Claude Code workflow explicitly instead of generic terminal flavor-text.

## Persona Red Flags
Jordan: unglossed jargon, no back-to-top, 4 equal contact options with no steer.
Riley: geolocation has no manual override; form has no draft persistence.
Casey: scroll-hijack correctly disabled <981px; but no persistent CTA past hero.

## Minor Observations
2026 hero-metric styled like a magnitude stat but is a year. Download CV vs Open PDF behave differently for the same file. No loading state during geolocation fetch. cramped-padding/nested-cards detector findings worth a manual look. No orientation aids on a long page.

## Questions to Consider
1. Second "peak" near the contact form to match the laptop-scrub opening?
2. Should the AI-assisted/CI-CD evidence be made visible on the page?
3. Consolidate to one primary contact channel plus a persistent CTA?
