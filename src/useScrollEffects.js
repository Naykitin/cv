import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function useScrollEffects() {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const handleAnchorClick = (event) => {
      const link = event.target.closest('a[href^="#"]');

      if (!link) {
        return;
      }

      const target = document.querySelector(link.getAttribute('href'));

      if (!target) {
        return;
      }

      event.preventDefault();
      gsap.to(window, {
        // autoKill would cancel the glide when ScrollTrigger pins adjust
        // scroll mid-flight; a click-initiated jump should always land.
        scrollTo: { y: target, offsetY: 16, autoKill: false },
        duration: 1.2,
        ease: 'power2.inOut',
        overwrite: 'auto',
      });
    };

    document.addEventListener('click', handleAnchorClick);

    const mm = gsap.matchMedia();

    // This block must be created FIRST: the experience pin adds spacer
    // height, and ScrollTrigger refreshes in creation order — triggers made
    // before a pin don't get pushed down by its spacer, which leaves every
    // section below with stale start/end positions.
    mm.add('(min-width: 981px)', () => {
      gsap.to('.hero-copy', {
        yPercent: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
      });

      const section = document.querySelector('.experience-section');
      const track = document.querySelector('.experience-section .timeline');

      if (section && track) {
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            // GSAP's default pin (position: fixed) escapes .portfolio-shell's
            // untransformed overflow: hidden and bleeds the translated track
            // past the viewport, inflating the document's horizontal scroll.
            pinType: 'transform',
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    });

    mm.add('(min-width: 1px)', () => {
      gsap.utils
        .toArray('.reveal')
        .filter(
          (element) =>
            !element.matches('.section-intro, .cards-section, .project-section, .education-section')
        )
        .forEach((element) => {
          gsap.from(element, {
            autoAlpha: 0,
            y: 44,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: element, start: 'top 86%', once: true },
          });
        });

      // Intro: label slides in, headline settles from a blur (echoing the
      // laptop zoom), copy drifts in from the right. Reverses on leave.
      const intro = document.querySelector('.section-intro');

      if (intro) {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: intro,
              start: 'top 80%',
              end: 'bottom 15%',
              toggleActions: 'play reverse play reverse',
            },
          })
          .from(intro.querySelector('.section-label'), { x: -36, autoAlpha: 0, duration: 0.5 })
          .fromTo(
            intro.querySelector('h2'),
            { y: 64, autoAlpha: 0, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.9 },
            '-=0.25'
          )
          .from(intro.querySelector('.summary-copy'), { x: 72, autoAlpha: 0, duration: 0.9 }, '-=0.6');
      }

      // Expertise: heading settles from a blur, cards rise in with a soft
      // scale, skills cascade after. Plays on arrival and stays put while
      // the section is on screen — it only resets once the section has
      // dropped fully below the viewport, so revisits replay cleanly and
      // nothing reverses mid-read.
      const cardsSection = document.querySelector('.cards-section');

      if (cardsSection) {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: cardsSection,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          })
          .from(cardsSection.querySelector('.section-label'), { x: -36, autoAlpha: 0, duration: 0.5 })
          .fromTo(
            cardsSection.querySelector('h2'),
            { y: 56, autoAlpha: 0, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.8 },
            '-=0.25'
          )
          .from(
            cardsSection.querySelectorAll('.service-card'),
            {
              y: 48,
              autoAlpha: 0,
              scale: 0.96,
              transformOrigin: '50% 100%',
              duration: 0.7,
              stagger: 0.1,
              // Let the CSS :hover translateY work again once settled.
              clearProps: 'transform',
            },
            '-=0.45'
          )
          .from(
            cardsSection.querySelectorAll('.skill-cloud span'),
            { y: 14, autoAlpha: 0, duration: 0.4, ease: 'power2.out', stagger: 0.03 },
            '-=0.35'
          );
      }

      // Personal project: copy column builds up, highlights slide in from
      // alternating sides. Plays on arrival, stays put while on screen, and
      // resets only after dropping fully below the viewport.
      const project = document.querySelector('.project-section');

      if (project) {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: project,
              start: 'top 78%',
              toggleActions: 'play none none reverse',
            },
          })
          .from(project.querySelector('.section-label'), { x: -36, autoAlpha: 0, duration: 0.5 })
          .fromTo(
            project.querySelector('h2'),
            { y: 56, autoAlpha: 0, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.8 },
            '-=0.25'
          )
          .from(
            // The label is a <p> too — exclude it, it has its own tween above
            // (double-targeting a .from() makes it capture the hidden state
            // as its destination and the element never appears).
            project.querySelectorAll('.project-copy p:not(.section-label), .project-copy .text-link'),
            { y: 28, autoAlpha: 0, duration: 0.6, stagger: 0.1 },
            '-=0.45'
          )
          .from(
            project.querySelectorAll('.project-list p'),
            {
              autoAlpha: 0,
              x: (index) => (index % 2 ? 64 : -64),
              duration: 0.7,
              stagger: 0.12,
              clearProps: 'transform',
            },
            '-=0.5'
          );
      }

      // Education: heading settles from a blur, the period stamps in.
      const education = document.querySelector('.education-section');

      if (education) {
        gsap
          .timeline({
            defaults: { ease: 'power3.out' },
            scrollTrigger: {
              trigger: education,
              start: 'top 82%',
              // Short section near the page end: only reverse once it has
              // fully left the viewport, or the hide plays while visible.
              end: 'bottom top',
              toggleActions: 'play reverse play reverse',
            },
          })
          .from(education.querySelector('.section-label'), { x: -36, autoAlpha: 0, duration: 0.5 })
          .fromTo(
            education.querySelector('h2'),
            { y: 44, autoAlpha: 0, filter: 'blur(10px)' },
            { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.8 },
            '-=0.25'
          )
          .from(
            education.querySelector('div p:not(.section-label)'),
            { y: 24, autoAlpha: 0, duration: 0.6 },
            '-=0.45'
          )
          .from(
            education.querySelector(':scope > span'),
            { x: 48, autoAlpha: 0, scale: 0.9, duration: 0.7, ease: 'back.out(1.6)' },
            '-=0.4'
          );
      }
    });

    return () => {
      mm.revert();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
}
